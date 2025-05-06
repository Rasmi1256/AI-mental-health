import os
import shutil
import librosa
import numpy as np
import joblib
from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session

from app.utils.auth import get_current_user
from app.models.database import get_session
from app.models.user import User
from app.models.emotion_log import EmotionLog

router = APIRouter()

# Load ML model and label encoder
model = joblib.load("ml_models/audio_emotion_model.pkl")
label_encoder = joblib.load("ml_models/audio_label_encoder.pkl")

@router.post("/audio-emotion")
async def detect_audio_emotion(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    os.makedirs("temp_audio", exist_ok=True)
    audio_path = f"temp_audio/{file.filename}"

    try:
        # Save file asynchronously
        with open(audio_path, "wb") as out_file:
            contents = await file.read()
            out_file.write(contents)

        # Extract features
        y, sr = librosa.load(audio_path, sr=None)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfccs_mean = np.mean(mfccs.T, axis=0).reshape(1, -1)

        # Predict emotion
        prediction = model.predict(mfccs_mean)
        predicted_emotion = label_encoder.inverse_transform(prediction)[0]

        # Log the result
        log = EmotionLog(
            user_id=current_user.id,
            analysis_type="audio",
            input_data=file.filename,
            result=predicted_emotion
        )
        session.add(log)
        session.commit()

        return JSONResponse({
            "predicted_emotion": predicted_emotion,
            "mfcc_mean": mfccs_mean.tolist()
        })

    except Exception as e:
        return JSONResponse(content={"error": f"Audio emotion detection failed: {str(e)}"}, status_code=500)

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

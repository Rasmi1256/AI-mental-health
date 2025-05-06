import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session
from deepface import DeepFace

from app.utils.auth import get_current_user
from app.models.database import get_session  # Corrected import
from app.models.user import User
from app.models.emotion_log import EmotionLog

router = APIRouter()

@router.post("/face-emotion")
async def detect_face_emotion(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    os.makedirs("temp_image", exist_ok=True)
    image_path = f"temp_image/{file.filename}"

    try:
        # Save uploaded file
        with open(image_path, "wb") as out_file:
            content = await file.read()
            out_file.write(content)

        # Analyze with DeepFace
        result = DeepFace.analyze(img_path=image_path, actions=['emotion'], enforce_detection=True)

        if isinstance(result, list):
            result = result[0]  # DeepFace may return a list of results

        emotion_data = result["emotion"]
        dominant_emotion = result["dominant_emotion"]

        # Log the analysis
        log = EmotionLog(
            user_id=current_user.id,
            analysis_type="face",
            input_data=file.filename,
            result=dominant_emotion
        )
        session.add(log)
        session.commit()

        return {
            "dominant_emotion": dominant_emotion,
            "emotion_scores": emotion_data
        }

    except Exception as e:
        return JSONResponse(content={"error": f"Emotion detection failed: {str(e)}"}, status_code=500)

    finally:
        # Clean up the temporary file
        if os.path.exists(image_path):
            os.remove(image_path)

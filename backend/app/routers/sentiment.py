from fastapi import APIRouter, Depends
from pydantic import BaseModel
from textblob import TextBlob
from app.utils.auth import get_current_user
from sqlmodel import Session
from app.models.database import get_session
from app.models.emotion_log import EmotionLog
from app.models.user import User


router = APIRouter()

class TextInput(BaseModel):
    message: str

@router.post("/sentiment")
def analyze_sentiment(text: TextInput, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    blob = TextBlob(text.message)
    polarity = blob.sentiment.polarity  # range: -1.0 (neg) to +1.0 (pos)

    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"


    log = EmotionLog(
        user_id=current_user.id,
        analysis_type="text",
        input_data=text.message,
        result=sentiment
    )   

    session.add(log)
    session.commit() 

    return {
        "sentiment": sentiment,
        "polarity_score": polarity,
        "original_message": text.message
    }

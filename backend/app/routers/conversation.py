from fastapi import APIRouter, Depends
from pydantic import BaseModel
from textblob import TextBlob
from sqlmodel import Session

from app.utils.auth import get_current_user
from app.models.database import get_session
from app.models.user import User
from app.models.emotion_log import EmotionLog

router = APIRouter()

class MessageInput(BaseModel):
    message: str

@router.post("/conversation")
def ai_companion_response(
    user_input: MessageInput,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    message = user_input.message.strip()

    if not message:
        return {
            "error": "Empty message received. Please send a valid message."
        }

    blob = TextBlob(message)
    polarity = blob.sentiment.polarity

    # Basic sentiment-based logic
    if polarity > 0.1:
        response = "I'm so glad to hear that. Keep shining! 😊"
    elif polarity < -0.1:
        response = "I'm here with you. Want to talk more about what's bothering you?"
    else:
        response = "I'm listening. Would you like to talk more about how you're feeling?"

    # Log the interaction
    log = EmotionLog(
        user_id=current_user.id,
        analysis_type="conversation",
        input_data=message,
        result=response
    )
    session.add(log)
    session.commit()

    return {
        "sentiment_score": polarity,
        "user_message": message,
        "companion_reply": response
    }

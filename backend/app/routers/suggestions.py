from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.database import get_session
from app.models.emotion_log import EmotionLog
from sqlmodel import Session, select

router = APIRouter()

# Predefined suggestions for moods
SUGGESTIONS = {
    "happy": {
        "message": "You're doing great! Keep enjoying the moment 😊",
        "suggestion": "Try a gratitude journaling session.",
    },
    "sad": {
        "message": "It’s okay to feel sad. You're not alone.",
        "suggestion": "Try a 5-minute calming meditation or a walk outside.",
    },
    "angry": {
        "message": "Take a deep breath. Let’s help you cool down.",
        "suggestion": "Try a breathing exercise or listen to calming music.",
    },
    "fear": {
        "message": "You're safe. Let’s ground ourselves.",
        "suggestion": "Try a 3-minute grounding exercise or affirmations.",
    },
    "neutral": {
        "message": "Let’s boost your energy or stay balanced.",
        "suggestion": "Try a short reflection or motivational video.",
    },
    "surprise": {
        "message": "Something unexpected happened?",
        "suggestion": "Take a moment to reflect. Want to talk to the AI friend?",
    },
}

@router.get("/suggestions")
def get_suggestion(
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user),
):
    latest_log = session.exec(
        select(EmotionLog)
        .where(EmotionLog.user_id == current_user.id)
        .order_by(EmotionLog.timestamp.desc())
    ).first()

    if not latest_log:
        return {"message": "No emotion data available yet.", "suggestion": "Start a quick check-in."}

    mood = latest_log.result.lower()

    if mood in SUGGESTIONS:
        return {
            "emotion": mood,
            "message": SUGGESTIONS[mood]["message"],
            "suggestion": SUGGESTIONS[mood]["suggestion"],
        }
    else:
        return {
            "emotion": mood,
            "message": "We're not sure how you're feeling, but we're here with you.",
            "suggestion": "Would you like to journal or meditate?",
        }

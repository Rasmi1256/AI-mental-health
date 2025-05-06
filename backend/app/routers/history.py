from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.database import get_session
from app.models.emotion_log import EmotionLog
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/history")
def get_emotion_history(
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    logs = session.exec(
        select(EmotionLog)
        .where(EmotionLog.user_id == current_user.id)
        .order_by(EmotionLog.timestamp.desc())
    ).all()
    return logs

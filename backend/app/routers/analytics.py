from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.models.database import get_session
from app.models.emotion_log import EmotionLog
from app.utils.auth import get_current_user
from datetime import datetime, timedelta
from collections import Counter

router = APIRouter()

@router.get("/analytics/emotions-daily")
def get_daily_emotion_trends(
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user),
):
    logs = session.exec(
        select(EmotionLog).where(EmotionLog.user_id == current_user.id)
    ).all()

    trends = {}
    for log in logs:
        day = log.timestamp.strftime("%Y-%m-%d")
        if day not in trends:
            trends[day] = []
        trends[day].append(log.result)

    daily_summary = [
        {
            "date": date,
            "top_emotion": Counter(emotions).most_common(1)[0][0],
            "all_emotions": Counter(emotions)
        }
        for date, emotions in sorted(trends.items())
    ]
    return daily_summary

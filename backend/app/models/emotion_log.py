from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .user import User  # Import for type checking only

class EmotionLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    analysis_type: str      # e.g. "text", "audio", "face"
    input_data: str         # the raw text, or filename, etc.
    result: str             # e.g. "happy", "sad", or JSON stringified for scores

    user: Optional["User"] = Relationship(back_populates="logs")



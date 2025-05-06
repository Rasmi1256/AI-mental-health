from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .emotion_log import EmotionLog  # Import for type checking only

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    logs: List["EmotionLog"] = Relationship(back_populates="user")  # Relationship to EmotionLog



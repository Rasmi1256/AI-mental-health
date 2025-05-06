from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.models.database import get_session
from app.schemas.user import UserCreate, UserLogin
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "pic1RHin6QIEUYrCyQb24qhfXVjh64o9Ze7EfZus2Us=")
ALGORITHM = "HS256"

@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.exec(select(User).where(User.username == user.username)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, password_hash=hashed_password)
    session.add(db_user)
    session.commit()
    return {"message": "User registered"}

@router.post("/login")
def login(form_data: UserLogin, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not db_user or not pwd_context.verify(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": db_user.username,
        "exp": datetime.now() + timedelta(hours=12)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token,
            "token_type": "bearer" 
            }

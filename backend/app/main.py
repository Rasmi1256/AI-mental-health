from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import hello, sentiment, conversation, audio_emotion, face_emotion, auth,history, analytics
from app.models.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()  # Run once at startup
    yield  # Continue serving the app
    # Cleanup code (if needed) goes here

app = FastAPI(title="AI Mental Health Companion API", lifespan=lifespan)

# CORS setup for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 👈 Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # 👈 Needed to allow Authorization header
)
# Registering all routers
app.include_router(hello.router)
app.include_router(sentiment.router)
app.include_router(conversation.router)
app.include_router(audio_emotion.router)
app.include_router(face_emotion.router)
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(analytics.router)

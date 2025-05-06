from fastapi import APIRouter
router = APIRouter()
@router.get("/hello")
def say_hello():
    return {"message" : "Hello, your AI MENTAL HEALTH IS LIVE"}
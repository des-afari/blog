from fastapi import APIRouter
from api.user.router import router as user_router
from api.tag.router import router as tag_router

api_router = APIRouter()
api_router.include_router(user_router, tags=['user'])
api_router.include_router(tag_router, tags=['tag'], prefix='/tag')
from fastapi import APIRouter
from api.user.router import router as user_router
from api.tag.router import router as tag_router
from api.article.router import router as article_router
from api.vote.router import router as vote_router
from api.comment.router import router as comment_router

api_router = APIRouter()
api_router.include_router(user_router, tags=['user'])
api_router.include_router(tag_router, tags=['tag'], prefix='/tag')
api_router.include_router(article_router, tags=['article'], prefix='/article')
api_router.include_router(vote_router, tags=['vote'], prefix='/vote')
api_router.include_router(comment_router, tags=['comment'], prefix='/comment')
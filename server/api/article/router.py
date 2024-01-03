from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.tag.model import Tag
from api.comment.model import Comment
from api.vote.model import Vote
from api.article.model import Article
from api.article.schemas import ArticleSchema, ArticleUpdateSchema, ArticleResponse
from utils.session import get_db
from api.user.oauth2 import get_user
from api.user.config import check_admin_permission, check_for_conflict
from secrets import token_hex

router = APIRouter()


@router.post('/create', status_code=201, response_model=ArticleResponse)
async def create_article(schema: ArticleSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)
    check_for_conflict(db, Article, 'title', schema.title)

    article = Article(
        id=token_hex(16),
        **schema.model_dump(exclude={'tags'})
    )

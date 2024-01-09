from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.tag.model import Tag
from api.comment.model import Comment
from api.vote.model import Vote
from api.article.model import Article
from api.article.schemas import ArticleSchema, ArticleUpdateSchema, ArticleResponse
from utils.session import get_db
from api.user.oauth2 import get_user
from api.user.config import check_admin_permission
from secrets import token_hex

router = APIRouter()


@router.post('/create', status_code=201, response_model=ArticleResponse)
async def create_article(schema: ArticleSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)

    article = Article(**schema.model_dump(exclude={'tags'}))
    article.id = f"{article.title.lower().replace(' ', '-')}-{token_hex(5)}"
    article.tags = db.query(Tag).filter(Tag.id.in_(schema.tags)).all()
    article.comments = db.query(Comment).filter(Comment.article_id == article.id).all()
    article.votes = db.query(Vote).filter(Vote.article_id == article.id).all()

    db.add(article)
    db.commit()

    return article


@router.get('/{article_id}', status_code=200, response_model=ArticleResponse)
async def get_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).get(article_id)

    if not article:
        raise HTTPException(404, detail='Article not found')
    
    return article


@router.put('/{article_id}/update', status_code=200, response_model=ArticleResponse)
async def updated_article(
    article_id: str, schema: ArticleUpdateSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)

    article = db.query(Article).get(article_id)

    if not article:
        raise HTTPException(404, detail='Article not found')
    
    form = schema.model_dump(exclude={'tags'}, exclude_unset=True)

    for key, value in form.items():
        setattr(article, key, value)

    if schema.tags:
        article.tags = db.query(Tag).filter(Tag.id.in_(schema.tags)).all()

    db.commit()
    db.refresh(article)

    return article


@router.delete('/{article_id}/delete', status_code=204)
async def delete_article(article_id: str, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)

    article = db.query(Article).get(article_id)

    if not article:
        raise HTTPException(404, detail='Article not found')
    
    db.delete(article)
    db.commit()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.tag.model import Tag
from api.tag.schemas import TagResponse, TagSchema
from typing import List
from utils.session import get_db
from api.user.config import check_admin_permission, check_for_conflict
from api.user.oauth2 import get_user
from api.article.model import Article
from api.article.schemas import ArticleResponse

router = APIRouter()


@router.post('/create', status_code=201, response_model=TagResponse)
async def create_tag(schema: TagSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)
    check_for_conflict(db, Tag, 'name', schema.name)

    tag = Tag(**schema.model_dump())
    tag.set_slug()

    db.add(tag)
    db.commit()

    return tag


@router.delete('/{tag_id}/delete', status_code=204)
async def delete_tag(tag_id: int, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)

    tag = db.query(Tag).get(tag_id)

    if not tag:
        raise HTTPException(404, detail='Tag not found')

    db.delete(tag) 
    db.commit()


@router.get('/{name}', status_code=200, response_model=List[ArticleResponse])
async def get_articles_by_tag(name: str, db: Session = Depends(get_db)):
    articles = db.query(Article).filter(Article.tags.any(name=name)).all()
        
    if not articles:
        raise HTTPException(404, detail='Articles not found')

    return articles
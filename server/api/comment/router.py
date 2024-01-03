from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.session import get_db
from api.user.oauth2 import get_user
from api.comment.model import Comment
from api.comment.schemas import CommentSchema, CommentResponse
from api.article.model import Article
from sqlalchemy.sql import exists

router = APIRouter()


@router.post('/{article_id}/create', status_code=201, response_model=CommentResponse)
async def create_comment(
    article_id: str, schema: CommentSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    if not db.query(Article).get(article_id):
        raise HTTPException(404, detail='Article not found')
    
    comment = Comment(user_id=user.id, article_id=article_id, comment=schema.comment)

    db.add(comment)
    db.commit()

    return comment


@router.patch('/{comment_id}/update', status_code=200, response_model=CommentResponse)
async def update_comment(
    comment_id: int, schema: CommentSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    comment = db.query(Comment).filter_by(id=comment_id, user_id=user.id).first()

    if not comment:
        raise HTTPException(403, detail='Operation cannot be completed')
    
    comment.comment = schema.comment

    db.commit()
    db.refresh(comment)

    return comment


@router.delete('/{comment_id}/delete', status_code=204)
async def delete_comment(
    comment_id: int, db: Session = Depends(get_db), user = Depends(get_user)):
    comment = db.query(Comment).filter_by(id=comment_id, user_id=user.id).first()

    if not comment:
        raise HTTPException(403, detail='Operation cannot be completed')

    db.delete(comment)
    db.commit()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.session import get_db
from api.user.oauth2 import get_user
from api.vote.model import Vote
from api.vote.schemas import VoteOutcome, VoteCheck
from api.article.model import Article
from sqlalchemy.sql import exists

router = APIRouter()


@router.get('/{article_id}', status_code=200, response_model=VoteOutcome)
async def vote_on_article(article_id: str, db: Session = Depends(get_db), user = Depends(get_user)):
    article = db.query(Article).get(article_id)

    if not article:
        raise HTTPException(404, detail='Article not found')
    
    query = db.query(Vote).filter_by(article_id=article_id, user_id=user.id).scalar()

    if not query:
        vote = Vote(article_id=article_id, user_id=user.id)

        db.add(vote)
        state = 'add'
    
    else:
        db.delete(query)
        state = 'remove'

    db.commit()

    return {"state": state, "user_id": user.id, "article_id": article_id}
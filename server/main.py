from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from utils.session import get_db
from api.api_v1 import api_router
from typing import List, Optional
from api.article.model import Article
from api.article.schemas import ArticleResponse
from api.tag.model import Tag
from api.tag.schemas import TagResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/', status_code=200)
async def root():
    return {"message": "connection established"}


@app.get('/api/v1/articles', status_code=200, response_model=List[ArticleResponse])
async def get_articles(query: Optional[str] = "", db: Session = Depends(get_db)):
    return db.query(Article).filter(Article.title.contains(query)).all()


@app.get('/api/v1/tags', status_code=200, response_model=List[TagResponse])
async def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()

app.include_router(api_router, prefix='/api/v1')
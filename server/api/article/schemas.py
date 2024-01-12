from pydantic import BaseModel
from typing import List
from datetime import datetime
from api.tag.schemas import TagResponse
from api.comment.schemas import CommentResponse
from api.vote.schemas import VoteResponse


class ArticleSchema(BaseModel):
    title: str
    article_img_url: str
    description: str = None
    content: str
    tags: List[str]


class ArticleUpdateSchema(BaseModel):
    title: str = None
    article_img_url: str = None
    description: str = None
    content: str = None
    tags: List[str] = None
    

class ArticleResponse(BaseModel):
    id: str
    title: str
    article_img_url: str
    description: str
    content: str
    featured: bool
    created_at: datetime
    updated_at: datetime | None
    tags: List[TagResponse]
    votes: List[VoteResponse]
    comments: List[CommentResponse]

    class Config:
        from_attributes = True
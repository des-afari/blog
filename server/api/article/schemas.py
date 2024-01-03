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
    tags: List[int]

    def __init__(self, title, **kwargs):
        super.__init__(title=title.lower().replace(' ', '-'), **kwargs)


class ArticleUpdateSchema(BaseModel):
    title: str = None
    article_img_url: str = None
    description: str = None
    content: str = None
    tags: List[int] = None
    

class ArticleResponse(BaseModel):
    id: str
    title: str
    article_img_url: str
    description: str
    content: str
    created_at: datetime
    updated_at: datetime | None
    tags: List[TagResponse]
    votes: List[VoteResponse]
    comments: List[CommentResponse]

    class Config:
        from_attributes = True
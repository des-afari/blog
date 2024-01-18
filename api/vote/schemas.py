from pydantic import BaseModel


class VoteResponse(BaseModel):
    article_id: str
    user_id: str

    class Config:
        from_attributes = True


class VoteOutcome(BaseModel):
    state: str
    user_id: str
    article_id: str

    class Config:
        from_attributes = True


class VoteCheck(BaseModel):
    vote_check: bool

    class Config:
        from_attributes = True
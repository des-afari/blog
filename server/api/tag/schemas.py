from pydantic import BaseModel


class TagSchema(BaseModel):
    parent_id: str = None
    name: str

 
class TagResponse(BaseModel):
    id: str
    parent_id: str | None
    name: str

    class Config:
        from_attributes = True
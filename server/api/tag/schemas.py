from pydantic import BaseModel


class TagSchema(BaseModel):
    parent_id: int = None
    name: str

 
class TagResponse(BaseModel):
    id: int
    parent_id: int | None
    name: str

    class Config:
        from_attributes = True
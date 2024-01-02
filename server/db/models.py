from db.base import Base, engine
from api.user.model import User
from api.json_token_id.model import JsonTokenId
from api.tag.model import Tag

Base.metadata.create_all(engine)
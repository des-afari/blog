from db.base import Base, engine
from api.user.model import User
from api.json_token_id.model import JsonTokenId

Base.metadata.create_all(engine)
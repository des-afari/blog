from db.base import Base, engine
from api.user.model import User
from api.json_token_id.model import JsonTokenId
from api.tag.model import Tag
from api.article.model import Article, association_table
from api.vote.model import Vote
from api.comment.model import Comment

Base.metadata.create_all(engine)
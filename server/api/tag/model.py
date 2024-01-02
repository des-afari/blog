from sqlalchemy import Column, String, Integer, func, TIMESTAMP, ForeignKey
from db.base import Base
from secrets import token_hex


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('tags.id'))
    name = Column(String(255), nullable=False, unique=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    def set_slug(self):
        self.name = self.name.title().replace(' ', '-')

    def __repr__(self) -> str:
        return f"Tag name={self.name} />"
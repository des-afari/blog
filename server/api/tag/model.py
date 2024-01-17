from sqlalchemy import Column, String, func, TIMESTAMP, ForeignKey
from db.base import Base


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(String(255), primary_key=True)
    parent_id = Column(String(255), ForeignKey('tags.id', ondelete='CASCADE'))
    name = Column(String(255), nullable=False, unique=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"Tag name={self.name} />"
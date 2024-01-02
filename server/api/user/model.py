from sqlalchemy import Column, String, Enum, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(255), primary_key=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'user'), nullable=False, default='user')
    last_login = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, onupdate=func.now())

    def set_slug(self):
        self.first_name = self.first_name.lower().replace(' ', '-')
        self.last_name = self.last_name.lower().replace(' ', '-')

    def __repr__(self) -> str:
        return f"<User email={self.email} />"
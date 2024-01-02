from passlib.context import CryptContext
from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import Type
from sqlalchemy.sql import exists

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def check_admin_permission(user):
    if user.role != 'admin':
        raise HTTPException(403, detail='You do not have permission to access this page')


def check_for_conflict(db: Session, model: Type, field: str, value: str):
    if db.query(exists().where(getattr(model, field) == value)).scalar():
        raise HTTPException(409, detail=f"{model.__name__} already exists")
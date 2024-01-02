from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.tag.model import Tag
from api.tag.schemas import TagResponse, TagSchema
from typing import List
from utils.session import get_db
from api.user.config import check_admin_permission,check_for_conflict
from api.user.oauth2 import get_user

router = APIRouter()


@router.post('/create', status_code=201, response_model=TagResponse)
async def create_category(schema: TagSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)
    check_for_conflict(db, Tag, 'name', schema.name)

    tag = Tag(**schema.model_dump())
    tag.set_slug()

    db.add(tag)
    db.commit()

    return tag


@router.delete('/{tag_id}/delete', status_code=204)
async def delete_category(tag_id: int, db: Session = Depends(get_db), user = Depends(get_user)):
    check_admin_permission(user)

    tag = db.query(Tag).get(tag_id)

    if not tag:
        raise HTTPException(404, detail='Tag not found')

    db.delete(tag) 
    db.commit()
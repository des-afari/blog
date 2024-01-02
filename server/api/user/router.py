from fastapi import APIRouter, HTTPException, Depends, Request, Response
from utils.session import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from api.json_token_id.model import JsonTokenId
from api.user.model import User
from api.user.config import hash_password, verify_password, check_admin_permission, check_for_conflict
from api.user.oauth2 import (access_private_key, access_public_key, create_token, verify_token,
                            refresh_private_key, refresh_public_key, get_user)
from api.user.schemas import (RegisterSchema, AuthResponse, EmailUpdateSchema, EmailUpdateResponse, UserUpdateSchema,
                              PasswordUpdateSchema, PasswordUpdateResponse, LogoutSchema, UserUpdateResponse)
from uuid import uuid4
from secrets import token_hex
from utils.config import settings
from datetime import datetime
from sqlalchemy.sql import exists

router = APIRouter()

@router.post('/register', status_code=201, response_model=AuthResponse)
async def register(response: Response, schema: RegisterSchema, db: Session = Depends(get_db)):
    check_for_conflict(db, User, 'email', schema.email)
    schema.password = hash_password(schema.password)

    user = User(**schema.model_dump(), id=str(uuid4()), last_login=datetime.now())
    user.set_slug()

    db.add(user)
    db.commit()

    access_token = create_token(
        data={"id": user.id, "role": user.role}, expiry=settings.ACCESS_EXPIRY, private_key=access_private_key)
    refresh_token = create_token(
        data={"id": user.id, "role": user.role}, expiry=settings.REFRESH_EXPIRY, private_key=refresh_private_key)
    
    response.set_cookie(
        key='_rt', value=refresh_token, expires=settings.REFRESH_EXPIRY * 60, path='/', secure=True,
        httponly=True, domain=None, samesite='lax')
    
    return {"access_token": access_token, "role": user.role, "auth_type": "Bearer"}


@router.post('/login', status_code=201, response_model=AuthResponse)
async def login(response: Response, form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=form.username.lower()).first()

    if not user or not verify_password(form.password, user.password):
        raise HTTPException(400, detail='Invalid credentials')
    
    access_token = create_token(
        data={"id": user.id, "role": user.role}, expiry=settings.ACCESS_EXPIRY, private_key=access_private_key)
    refresh_token = create_token(
        data={"id": user.id, "role": user.role}, expiry=settings.REFRESH_EXPIRY, private_key=refresh_private_key)
    
    response.set_cookie(
        key='_rt', value=refresh_token, expires=settings.REFRESH_EXPIRY * 60, path='/', secure=True,
        httponly=True, domain=None, samesite='lax')
    
    user.last_login = datetime.now()
    db.commit()

    return {"access_token": access_token, "role": user.role, "auth_type": "Bearer"}


@router.get('/refresh', status_code=200, response_model=AuthResponse)
async def refresh(request: Request, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get('_rt')

    if not refresh_token:
        raise HTTPException(404, detail='Refresh token not found')
    
    payload = verify_token(token=refresh_token, public_key=refresh_public_key, 
                           credential_exception=HTTPException(
                            401, detail='Invalid token', headers={"WWW-Authenticate": "Bearer"}))

    if db.query(exists().where(JsonTokenId.id == payload.jti)).scalar():
        raise HTTPException(401, detail='Token expired')
    
    access_token = create_token(
        data={"id": payload.id, "role": payload.role}, expiry=settings.ACCESS_EXPIRY, private_key=access_private_key)
    
    return {"access_token": access_token, "role": payload.role, "auth_type": "Bearer"}


@router.patch('/email/update', status_code=200, response_model=EmailUpdateResponse)
async def update_email(schema: EmailUpdateSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    check_for_conflict(db, User, 'email', schema.email)
    current_user = db.query(User).filter_by(id=user.id).first()

    if not current_user:
        raise HTTPException(404, detail=f'User not found')

    current_user.email = schema.email
    db.commit()
    db.refresh(current_user)

    return current_user


@router.patch('/password/update', status_code=200, response_model=PasswordUpdateResponse)
async def update_password(schema: PasswordUpdateSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    current_user = db.query(User).filter_by(id=user.id).first()

    if not current_user:
        raise HTTPException(404, detail=f'User not found')
    
    if not verify_password(schema.old_password, current_user.password):
        raise HTTPException(400, detail='Invalid current password')
    
    current_user.password = hash_password(schema.new_password)
    db.commit()
    db.refresh(current_user)

    return {"message": "Password updated successfully"}


@router.put('/user/update', status_code=200, response_model=UserUpdateResponse)
async def update_user(schema: UserUpdateSchema, db: Session = Depends(get_db), user = Depends(get_user)):
    current_user = db.query(User).filter_by(id=user.id).first()

    if not current_user:
        raise HTTPException(404, detail=f'User not found')

    form = schema.model_dump(exclude_unset=True)

    for key, value in form.items():
        setattr(current_user, key, value)

    current_user.set_slug()
    
    db.commit()
    db.refresh(current_user)

    return current_user


@router.post('/logout', status_code=204)
async def logout(request: Request, response: Response, schema: LogoutSchema, db: Session = Depends(get_db)):
    if schema.access_token: 
        access_payload = verify_token(
            token=schema.access_token, public_key=access_public_key,
            credential_exception=HTTPException(401, detail='Invalid token', headers={"WWW-Authenticate": "Bearer"}))

        access_jti = JsonTokenId(id=access_payload.jti)
        db.add(access_jti)

    refresh_token = request.cookies.get('_rt')

    if refresh_token:
        refresh_payload = verify_token(
            token=refresh_token, public_key=refresh_public_key,
            credential_exception=HTTPException(401, detail='Invalid token', headers={"WWW-Authenticate": "Bearer"}))

        refresh_jti = JsonTokenId(id=refresh_payload.jti)
        db.add(refresh_jti)

    response.delete_cookie('_rt')
    db.commit()


@router.delete('/user/delete', status_code=204)
async def delete_user(db: Session = Depends(get_db), user = Depends(get_user)):
    current_user = db.query(User).filter_by(id=user.id).first()

    if not current_user:
        raise HTTPException(404, detail=f'User not found')
    
    db.delete(current_user)
    db.commit()
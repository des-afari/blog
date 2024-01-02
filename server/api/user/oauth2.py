from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from sqlalchemy.orm import Session
from utils.session import get_db
from utils.config import settings
from datetime import datetime, timedelta
from secrets import token_hex
from jose import jwt, JWTError
from api.user.schemas import JWTResponse
from api.json_token_id.model import JsonTokenId
from sqlalchemy.sql import exists

def load_private_key(route: str, password: str):
    try:
        with open(route, 'rb') as file:
            private_key = serialization.load_pem_private_key(
                file.read(),
                password=password.encode('utf-8'),
                backend=default_backend()
            )

        return private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
    
    except FileNotFoundError:
        raise HTTPException(500, detail='Private key file not found')
    
def load_public_key(route: str):
    with open(route, 'rb') as file:
        return serialization.load_pem_public_key(
            file.read(),
            backend=default_backend()
        )
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

# load keys
access_private_key = load_private_key('keys/access/private_key.pem', settings.ACCESS_KEY)
refresh_private_key = load_private_key('keys/refresh/private_key.pem', settings.REFRESH_KEY)

access_public_key = load_public_key('keys/access/public_key.pem')
refresh_public_key = load_public_key('keys/refresh/public_key.pem')

# create token
def create_token(data: dict, expiry: int, private_key):
    to_encode = data.copy()

    to_encode.update({
		'iat': datetime.now(),
		'exp': datetime.now() + timedelta(minutes=expiry),
		'jti': token_hex(32)
	})
    
    return jwt.encode(to_encode, private_key, algorithm='RS256')

# verify token
def verify_token(token: str, public_key, credential_exception):
    try:
        payload = jwt.decode(token, public_key, algorithms=['RS256'])
        id: str = payload.get('id')
        jti: str = payload.get('jti')
        role: str = payload.get('role')

    except FileNotFoundError:
        raise HTTPException(500, detail='Public key not found')

    except JWTError:
        raise credential_exception
    
    return JWTResponse(id=id, jti=jti, role=role)

# get user
async def get_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(
		401,
		detail='Could not validate credentials',
		headers={"WWW-Authenticate": "Bearer"}
	)

    payload = verify_token(token, public_key=access_public_key, credential_exception=credential_exception)
    
    if db.query(exists().where(getattr(JsonTokenId, 'id') == payload.jti)).scalar():
        raise HTTPException(
        401,
        detail='Authentication failed',
        headers={"WWW-Authenticate": "Bearer"}
        )

    return payload
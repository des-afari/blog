from pydantic import BaseModel, EmailStr
from datetime import datetime

class JWTResponse(BaseModel):
    id: str 
    jti: str
    role: str

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        from_attributes = True


class UsersResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    created_at: datetime
    last_login: datetime

    class Config:
        from_attributes = True


class RegisterSchema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    def __init__(self, email: EmailStr, password: str, first_name: str, last_name: str):
        super().__init__(email=email.lower(), password=password,
                        first_name=first_name, last_name=last_name)


class AuthResponse(BaseModel):
    id: str
    access_token: str
    role: str
    auth_type: str = 'Bearer'

    class Config:
        from_attributes = True


class EmailUpdateSchema(BaseModel):
    email: EmailStr

    def __init__(self, email: EmailStr):
        super().__init__(email=email.lower())


class PasswordUpdateSchema(BaseModel):
    old_password: str
    new_password: str


class PasswordUpdateResponse(BaseModel):
    message: str = 'Password updated successfully'

    class Config:
        from_attributes = True


class UserUpdateSchema(BaseModel):
    first_name: str = None
    last_name: str = None


class LogoutSchema(BaseModel):
    access_token: str = None
from fastapi import APIRouter, Depends, status
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session

import datetime

from src.services.user_service import UserService
from src.services.jwt_service import JWTService

from src.schemas.register_scheme import RegisterScheme
from src.schemas.login_scheme import LoginScheme
from src.schemas.token_response_scheme import TokenResponseScheme

from src.get_db import get_db

router = APIRouter()

class Settings(BaseModel):
    authjwt_secret_key: str = "(,,>﹏<,,)( ^ω^ )⸜(｡ ˃ ᵕ ˂ )⸝♡(⸝⸝⸝╸w╺⸝⸝⸝)≽^•⩊•^≼(╥﹏╥)(⸝⸝⸝>﹏<⸝⸝⸝)(>/////<)"

@AuthJWT.load_config
def get_config():
    return Settings()

@router.post("/register", response_model=TokenResponseScheme, status_code=status.HTTP_201_CREATED)
def register(
    register_scheme: RegisterScheme, 
    auth: AuthJWT = Depends(), 
    db: Session = Depends(get_db)
):
    user_service = UserService()
    jwt_service = JWTService()
    user_service.check_if_user_exists(register_scheme.username, db)
    new_user = user_service.create_user(register_scheme.username, register_scheme.password, db)

    tokens = jwt_service.create_tokens(new_user, auth, "User successfully registered")

    return tokens

@router.post("/login", response_model=TokenResponseScheme)
def login(
    login_scheme: LoginScheme, 
    auth: AuthJWT = Depends(), 
    db: Session = Depends(get_db)
):
    user_service = UserService()
    jwt_service = JWTService()

    user = user_service.get_user_by_username(login_scheme.username, db)
    user_service.verify_password(login_scheme.password, user.password_hash)

    tokens = jwt_service.create_tokens(user, auth, "Login successful")

    return tokens

@router.post('/refresh')
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()

    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user, expires_time=datetime.timedelta(seconds=300))
    return {"access_token": new_access_token}
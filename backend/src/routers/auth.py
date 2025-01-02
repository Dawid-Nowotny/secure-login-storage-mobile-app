from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.services.user_service import UserService
from src.services.jwt_service import JWTService

from src.schemas.register_scheme import RegisterScheme
from src.schemas.token_response_scheme import TokenResponseScheme

from src.get_db import get_db

router = APIRouter()

class Settings(BaseModel):
    authjwt_secret_key: str = "(,,>﹏<,,)( ^ω^ )⸜(｡ ˃ ᵕ ˂ )⸝♡(⸝⸝⸝╸w╺⸝⸝⸝)≽^•⩊•^≼(╥﹏╥)(⸝⸝⸝>﹏<⸝⸝⸝)(>/////<)"

@AuthJWT.load_config
def get_config():
    return Settings()

@router.post("/register", response_model=TokenResponseScheme)
def register(register_scheme: RegisterScheme, auth: AuthJWT = Depends(), db: Session = Depends(get_db)):
    user_service = UserService()
    jwt_service = JWTService()
    user_service.check_if_user_exists(register_scheme.username, db)
    new_user = user_service.create_user(register_scheme.username, register_scheme.password, db)

    tokens = jwt_service.create_tokens(new_user, auth, "User successfully registered")

    return tokens
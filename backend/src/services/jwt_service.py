from fastapi_jwt_auth import AuthJWT

import datetime

from src.models import User

class JWTService:
    def create_tokens(self, user: User, auth: AuthJWT, message: str) -> dict:
            access_token = auth.create_access_token(subject=user.username, expires_time=datetime.timedelta(seconds=300))
            refresh_token = auth.create_refresh_token(subject=user.username)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "message": message 
            }
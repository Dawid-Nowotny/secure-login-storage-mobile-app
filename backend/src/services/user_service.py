from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext

from src.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def check_if_user_exists(self, username: str, db: AsyncSession) -> None:
        username = db.query(User).filter(User.username == username).first()
        if username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
            )
        
    def create_user(self, username: str, password: str, db: AsyncSession) -> User:
        hashed_password = pwd_context.hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
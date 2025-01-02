from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def check_if_user_exists(self, username: str, db: Session) -> None:
        username = db.query(User).filter(User.username == username).first()
        if username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
            )
        
    def create_user(self, username: str, password: str, db: Session) -> User:
        hashed_password = pwd_context.hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    
    def get_user_by_username(self, username: str, db: Session) -> User:
        user = db.query(User).filter_by(username=username).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
        return user

    def verify_password(self, password: str, hashed_password: str) -> None:
        if not pwd_context.verify(password, hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
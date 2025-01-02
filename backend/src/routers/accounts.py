from fastapi import APIRouter, HTTPException, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

from typing import List

from src.services.user_service import UserService
from src.services.account_service import AccountService

from src.schemas.account_scheme import AccountScheme

from src.get_db import get_db

router = APIRouter()

@router.put("/accounts/sync")
def sync_accounts(
    accounts: List[AccountScheme],
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    user_service = UserService()
    account_service = AccountService()

    user = user_service.get_user_by_username(current_user, db)

    try:
        account_service.remove_saved_accounts(user.id, db)
        account_service.sync_user_accounts(accounts, user, db)
        return {"message": "Accounts synced successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to sync accounts") from e
    
@router.get("/accounts", response_model=List[AccountScheme])
def fetch_accounts(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    user_service = UserService()
    account_service = AccountService()

    user = user_service.get_user_by_username(current_user, db)
    encryption_key = user.generate_encryption_key(user.password_hash)
    return account_service.get_user_accounts(user.id, encryption_key, db)
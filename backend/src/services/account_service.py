from sqlalchemy.orm import Session

from src.models import Account
from src.schemas.account_scheme import AccountScheme

from typing import List

class AccountService:
    def remove_saved_accounts(self, user_id: int, db: Session) -> None:
        db.query(Account).filter_by(user_id=user_id).delete()

    def sync_user_accounts(self, accounts: List[AccountScheme], user_id: int, db: Session) -> None:
        for account in accounts:
            new_account = Account(
                platform_name=account.platform_name,
                username=account.username,
                password_encrypted=account.password_encrypted,
                user_id=user_id
            )
            db.add(new_account)

        db.commit()

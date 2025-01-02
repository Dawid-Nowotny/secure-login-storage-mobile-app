from sqlalchemy.orm import Session

from src.models import Account, User
from src.schemas.account_scheme import AccountScheme

from typing import List

class AccountService:
    def remove_saved_accounts(self, user_id: int, db: Session) -> None:
        db.query(Account).filter_by(user_id=user_id).delete()

    def sync_user_accounts(self, accounts: List[AccountScheme], user: User, db: Session) -> None:
        encryption_key = user.generate_encryption_key(user.password_hash)

        for account in accounts:
            new_account = Account(
                platform_name=account.platform_name,
                username=account.username,
                password_encrypted=Account.encrypt_password(account.password_encrypted.decode(), encryption_key),
                user_id=user.id
            )
            db.add(new_account)

        db.commit()

    def get_user_accounts(self, user_id: int, encryption_key: bytes, db: Session) -> List[AccountScheme]:
        accounts = db.query(Account).filter_by(user_id=user_id).all()
        result = []
        for account in accounts:
            decrypted_password = account.decrypt_password(account.password_encrypted, encryption_key)
            result.append(
                AccountScheme(
                    platform_name=account.platform_name,
                    username=account.username,
                    password_encrypted=decrypted_password
                )
            )
        return result
from pydantic import BaseModel

class AccountScheme(BaseModel):
    platform_name: str
    username: str
    password_encrypted: bytes

    class Config:
        orm_mode = True
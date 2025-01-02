from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship, Mapped
from passlib.context import CryptContext
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.padding import PKCS7
from cryptography.hazmat.backends import default_backend

import os

try:
    from src.database import Base
except ModuleNotFoundError:
    from .database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    username = Column(String(24), index=True, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    accounts: Mapped[list["Account"]] = relationship(back_populates="owner", cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password_hash = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)

    def generate_encryption_key(self, password: str) -> bytes:
        salt = self.username.encode()
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100_000,
            backend=default_backend()
        )
        return kdf.derive(password.encode())

class Account(Base):
    __tablename__ = "Account"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    platform_name = Column(String(50), nullable=False)
    username = Column(String(255), nullable=False)
    password_encrypted = Column(LargeBinary, nullable=False)

    user_id = Column(Integer, ForeignKey('User.id'), nullable=False)
    owner: Mapped["User"] = relationship(back_populates="accounts")

    @staticmethod
    def encrypt_password(password: str, key: bytes) -> bytes:
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        padder = PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(password.encode()) + padder.finalize()
        encrypted = encryptor.update(padded_data) + encryptor.finalize()
        return iv + encrypted

    def decrypt_password(self, encrypted_password: bytes, key: bytes) -> str:
        iv = encrypted_password[:16]
        encrypted_data = encrypted_password[16:]
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        unpadder = PKCS7(algorithms.AES.block_size).unpadder()
        padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
        return unpadder.update(padded_data) + unpadder.finalize()
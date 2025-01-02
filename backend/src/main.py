from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routers import auth, accounts

app = FastAPI()

origins = [
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/user", tags=["User"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["Accounts"])
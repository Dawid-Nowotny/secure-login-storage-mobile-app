from pydantic import BaseModel, Field

class RegisterScheme(BaseModel):
    username: str = Field(min_length=4,max_length=24)
    password: str = Field(min_length=6,max_length=32)
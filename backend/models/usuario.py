from pydantic import BaseModel

class usuario(BaseModel):
    username: str
    password: str
    rol: str = "admin"
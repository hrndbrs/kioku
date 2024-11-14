from typing import Tuple
from pydantic import BaseModel
from .common import CommonModel


class User(CommonModel):
    email: str
    password: str
    full_name: str
    profile_pic: str
    fields: Tuple[str, ...] = "id", "email", "password", "full_name", "profile_pic"


class LoginCredential(BaseModel):
    email: str
    password: str

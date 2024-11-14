from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

from models.jwt import JwtPayload
from models.user import LoginCredential
from services.user_service import UserService
from utils.bcrypt import compare_password
from utils.jwt import generateToken


router = APIRouter()


@router.post("/login")
def login(cred: LoginCredential, user_service: Annotated[UserService, Depends()]):

    try:
        user = user_service.get_by_attr(email=cred.email)[0]
        if not compare_password(cred.password, user.password):
            raise Exception()
        token: str = generateToken(JwtPayload(user.id))

        return {
            "message": "Logged in successfully",
            "data": {"access_token": token},
        }
    except:
        raise HTTPException(status_code=400, detail="Email/password is incorrect")

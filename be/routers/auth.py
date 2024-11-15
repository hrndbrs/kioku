from fastapi import APIRouter, HTTPException
from models.jwt import JwtPayload
from models.user import LoginCredential, RegistrationPayload
from services.base_service import IDInjectable
from services.user_service import UserInjectable
from utils.bcrypt import compare_password
from utils.jwt import generateToken


router = APIRouter()


@router.post("/login")
def login(cred: LoginCredential, user_service: UserInjectable):
    try:
        user = user_service.get_by_attr(email=cred.email)[0]

        if not compare_password(cred.password, user.password):
            raise Exception()

        token: str = generateToken(JwtPayload(user.id))

        return {
            "access_token": token,
        }
    except:
        raise HTTPException(status_code=400, detail="Email/password is incorrect")


@router.post("/register", status_code=201)
def register(
    new_user: RegistrationPayload,
    user_service: UserInjectable,
    id_service: IDInjectable,
):
    try:
        users = user_service.get_by_attr(email=new_user.email)
        print(users)

        if len(users) != 0:
            raise ValueError("Email has been used")

        user = user_service.add(id_service.get_id("users") + 1, new_user)
        user_service.save(id_service)
        token: str = generateToken(JwtPayload(user.id))

        return {
            "access_token": token,
        }
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    except Exception as e:
        raise HTTPException(500, detail=f"Unhandled error: {str(e)}")

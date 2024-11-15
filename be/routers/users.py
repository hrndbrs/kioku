from fastapi import APIRouter, HTTPException

from routers.headers import AuthorizationHeader
from services.user_service import UserInjectable
from utils.jwt import decodeToken


router = APIRouter()


@router.get("/profile")
def get_user_profile(
    user_service: UserInjectable, authorization: AuthorizationHeader = None
):
    if not authorization:
        raise HTTPException(401, detail="User is not logged in")
    try:
        payload = decodeToken(authorization)
        user = user_service.get_by_attr(id=payload.id)[0]
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "profile_pic": user.profile_pic,
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

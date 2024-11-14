import jwt
import os
from models.jwt import JwtPayload

JWT_SECRET: str = os.getenv("JWT_SECRET", default="secret")
HASHING_ALGO: str = "HS256"


def generateToken(payload: JwtPayload) -> str:
    return jwt.encode(payload.__dict__, JWT_SECRET, algorithm=HASHING_ALGO)


def decodeToken(token: str) -> JwtPayload:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[HASHING_ALGO])
        return JwtPayload(payload["id"])
    except jwt.MissingRequiredClaimError as e:
        message: str = f"JWT: Missing required claim: {e.claim}"
    except Exception as e:
        message: str = "JWT: Unable to decode token"

    raise Exception(message)

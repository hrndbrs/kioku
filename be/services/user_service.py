from models.user import User
from .base_service import BaseService


class UserService(BaseService[User]):
    def __init__(self) -> None:
        super().__init__("users", User)

from typing import Annotated
from fastapi import Depends
from models.user import RegistrationPayload, User
from utils.bcrypt import hash_password
from .base_service import BaseService


class UserService(BaseService[User]):
    def __init__(self) -> None:
        super().__init__("users", User)

    def add(self, id: int, new_user: RegistrationPayload) -> User:
        users = self.get_by_attr(email=new_user.email)
        if len(users) > 0:
            raise ValueError("Email has been registered")
        user = User(
            id=id,
            email=new_user.email,
            full_name=new_user.full_name,
            password=hash_password(new_user.password),
            profile_pic=new_user.profile_pic,
        )
        self.models = [*self.models, user]
        return user


UserInjectable = Annotated[UserService, Depends()]

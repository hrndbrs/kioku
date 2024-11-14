from typing import Any, Tuple
from pydantic import BaseModel


class CommonModel(BaseModel):
    id: int
    fields: Tuple[str, ...] = ("id",)

    def get_attr(self, attr_name: str):
        return getattr(self, attr_name)

    def set_attr(self, attr_name: str, val: Any):
        return setattr(self, attr_name, val)

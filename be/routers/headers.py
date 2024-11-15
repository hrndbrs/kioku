from typing import Annotated

from fastapi import Header

AuthorizationHeader = Annotated[str | None, Header()]

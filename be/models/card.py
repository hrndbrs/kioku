from pydantic import BaseModel


class Card(BaseModel):
    id: int
    deck_id: int
    front: str
    back: str

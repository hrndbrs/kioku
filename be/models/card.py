from typing import Tuple
from models.common import CommonModel


class Card(CommonModel):
    deck_id: int
    front: str
    back: str
    fields: Tuple[str, ...] = "id", "deck_id", "front", "back"

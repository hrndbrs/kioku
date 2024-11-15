from typing import List, Tuple
from models.common import CommonModel
from .card import Card


class Deck(CommonModel):
    name: str
    cards: List[Card] = []
    user_id: int
    fields: Tuple[str, ...] = "id", "name", "user_id"

    def add_cards(self, cards: List[Card]) -> "Deck":
        self.cards = cards
        return self

    def shuffle(self) -> "Deck":
        return self

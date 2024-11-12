from typing import List
from pydantic import BaseModel
from .card import Card


class Deck(BaseModel):
    id: int
    name: str
    cards: List[Card] = []

    def add_cards(self, cards: List[Card]) -> "Deck":
        self.cards = cards
        return self

    def shuffle(self) -> "Deck":
        return self

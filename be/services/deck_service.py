from typing import Annotated, List
from fastapi import Depends
from models.card import Card
from models.deck import Deck
from .base_service import BaseService


class DeckService(BaseService[Deck]):
    def __init__(self) -> None:
        super().__init__("decks", Deck)

    def get_by_id(self, id: int, cards: List[Card]) -> Deck:
        return next(
            deck.add_cards([card for card in cards if card.deck_id == id])
            for deck in self.models
            if deck.id == id
        )

    def add(self, new_deck: Deck) -> Deck:
        if any(deck.name == new_deck.name for deck in self.models):
            raise ValueError(f"The collection {new_deck.name} already exists")

        self.models = [*self.models, new_deck]

        return new_deck


DeckInjectable = Annotated[DeckService, Depends()]

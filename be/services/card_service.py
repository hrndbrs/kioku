from typing import Annotated
from fastapi import Depends
from models.card import Card
from .base_service import BaseService


class CardService(BaseService[Card]):
    def __init__(self) -> None:
        super().__init__("cards", Card)

    def delete_by_deck_id(self, id: int) -> "CardService":
        self.models = [card for card in self.models if card.deck_id != id]
        return self


CardInjectable = Annotated[CardService, Depends()]

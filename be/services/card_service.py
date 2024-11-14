import json
from typing import List
from models.card import Card
from .base_service import BaseService, IDIndexService


class CardService(BaseService):
    cards: List[Card]

    def __init__(self) -> None:
        super().__init__("cards")
        self.cards = [Card(**card) for card in self.db]

    def add(self, id: int, new_deck_id: int, new_cards: List[Card]) -> "CardService":
        for card in new_cards:
            id = id + 1
            card.id = id
            card.deck_id = new_deck_id

        self.cards = [*self.cards, *new_cards]

        return self

    def save(self, id_service: IDIndexService) -> "CardService":
        self.cards.sort(key=lambda c: c.id)
        self.file.seek(0)
        self.file.truncate()
        json.dump(
            [
                {
                    "id": card.id,
                    "deck_id": card.deck_id,
                    "front": card.front,
                    "back": card.back,
                }
                for card in self.cards
            ],
            self.file,
            indent=2,
        )

        id_service.overwrite(cards=self.cards[-1].id)

        return self

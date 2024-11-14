import json
from typing import List
from models.card import Card
from models.deck import Deck
from .base_service import BaseService, IDIndexService


class DeckService(BaseService):
    decks: List[Deck]

    def __init__(self) -> None:

        super().__init__("decks")
        self.decks = [Deck(**deck) for deck in self.db]

    def get_by_id(self, id: int, cards: List[Card]) -> Deck:
        return next(
            deck.add_cards([card for card in cards if card.deck_id == id])
            for deck in self.decks
            if deck.id == id
        )

    def add(self, new_deck: Deck) -> "DeckService":
        if any(deck.name == new_deck.name for deck in self.decks):
            raise ValueError()

        self.decks = [*self.decks, new_deck]

        return self

    def save(self, id_service: IDIndexService) -> "DeckService":
        self.decks.sort(key=lambda d: d.id)
        self.file.seek(0)
        self.file.truncate()
        json.dump(
            [{"id": deck.id, "name": deck.name} for deck in self.decks],
            self.file,
            indent=2,
        )

        id_service.overwrite(decks=self.decks[-1].id)

        return self

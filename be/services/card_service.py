from models.card import Card
from .base_service import BaseService


class CardService(BaseService[Card]):
    def __init__(self) -> None:
        super().__init__("cards", Card)

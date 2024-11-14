from fastapi import APIRouter, Depends, HTTPException
from models.deck import Deck
from typing import Annotated
from services.base_service import IDIndexService
from services.card_service import CardService
from services.deck_service import DeckService

router = APIRouter()


@router.get("")
def get_available_decks(deck_service: Annotated[DeckService, Depends()]):
    return [{"id": deck.id, "name": deck.name} for deck in deck_service.models]


@router.get("/{id}", response_model=Deck)
def get_deck_by_id(
    id: int,
    deck_service: Annotated[DeckService, Depends()],
    card_service: Annotated[CardService, Depends()],
):
    try:
        return deck_service.get_by_id(id, card_service.models)
    except StopIteration:
        raise HTTPException(404, detail=f"No deck with the id {id} was found.")
    except Exception as e:
        raise HTTPException(500, detail=f"Unhandled exception: {str(e)}")


@router.post("", status_code=201)
def add_new_deck(
    new_deck: Deck,
    deck_service: Annotated[DeckService, Depends()],
    card_service: Annotated[CardService, Depends()],
    id_service: Annotated[IDIndexService, Depends()],
):
    try:
        card_id = id_service.get_id("cards")
        new_deck.id = id_service.get_id("decks") + 1
        deck_service.add(new_deck)

        for card in new_deck.cards:
            card_id += 1
            card.id = card_id
            card.deck_id = new_deck.id
            card_service.add(card)

        deck_service.save(id_service)
        card_service.save(id_service)

        return {"message": f"Successfully created a new deck with id {new_deck.id}"}
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    except Exception as e:
        raise HTTPException(500, detail=f"Unhandled error: {str(e)}")


@router.post("/import")
def import_deck():
    raise HTTPException(501, detail="Not implemented")

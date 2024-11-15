from fastapi import APIRouter, HTTPException
from models.deck import Deck
from routers.headers import AuthorizationHeader
from services.base_service import IDInjectable
from services.card_service import CardInjectable
from services.deck_service import DeckInjectable
from services.user_service import UserInjectable
from utils.jwt import decodeToken

router = APIRouter()


@router.get("")
def get_available_decks(deck_service: DeckInjectable):
    return [
        {"id": deck.id, "user_id": deck.user_id, "name": deck.name}
        for deck in deck_service.models
    ]


@router.get("/{id}", response_model=Deck)
def get_deck_by_id(
    id: int,
    deck_service: DeckInjectable,
    card_service: CardInjectable,
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
    deck_service: DeckInjectable,
    card_service: CardInjectable,
    user_service: UserInjectable,
    id_service: IDInjectable,
    authorization: AuthorizationHeader = None,
):
    if not authorization:
        raise HTTPException(401, detail="Log in to add a new deck")

    try:

        payload = decodeToken(authorization)
        user = user_service.get_by_attr(id=payload.id)[0]

        card_id = id_service.get_id("cards")
        new_deck.id = id_service.get_id("decks") + 1
        new_deck.user_id = user.id
        deck_service.add(new_deck)

        for card in new_deck.cards:
            card_id += 1
            card.id = card_id
            card.deck_id = new_deck.id
            card_service.add(card)

        deck_service.save(id_service)
        card_service.save(id_service)

        return {"message": f"Successfully created a new deck with id {new_deck.id}"}
    except IndexError:
        raise HTTPException(401, detail="You have to log in to add a new deck")
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    except Exception as e:
        raise HTTPException(500, detail=f"Unhandled error: {str(e)}")


@router.delete("/{id}")
def delete_deck(
    id: int,
    deck_service: DeckInjectable,
    card_service: CardInjectable,
    authorization: AuthorizationHeader = None,
):
    try:
        if not authorization:
            raise Exception()
        removed_card = deck_service.delete_by_id(id)
        card_service.delete_by_deck_id(id)
        card_service.save()
        deck_service.save()
        return removed_card
    except StopIteration:
        raise HTTPException(404, detail="No deck was found")
    except:
        raise HTTPException(403, detail="Only the creator of this deck can delete it")


@router.post("/import")
def import_deck():
    raise HTTPException(501, detail="Not implemented")

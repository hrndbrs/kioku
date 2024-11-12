import json
from fastapi import APIRouter, HTTPException
from models.card import Card
from models.deck import Deck
from typing import List

router = APIRouter()


@router.get("", response_model=List[Deck])
def get_available_decks():
    with open("db/decks.json", "r") as f:
        decks_db = json.load(f)
        f.close()
    decks: List[Deck] = [Deck(**deck) for deck in decks_db]
    return decks


@router.get("/{id}", response_model=Deck)
def get_named_deck(id: int):
    try:
        with open("db/decks.json", "r") as f:
            decks_db = json.load(f)
            f.close()

        deck: Deck = Deck(**next(deck for deck in decks_db if deck["id"] == id))

        with open("db/cards.json", "r") as f:
            cards_db = json.load(f)
            f.close()

        cards: List[Card] = [Card(**card) for card in cards_db if card["deck_id"] == id]

        deck.add_cards(cards)

        return deck
    except Exception as e:
        print(e)
        raise HTTPException(404, detail=f"No deck with the id {id} was found.")


@router.post("", status_code=201)
def add_new_deck(new_deck: Deck):
    try:
        f1 = open("db/decks.json", "r+")
        f2 = open("db/cards.json", "r+")
        f3 = open("db/id_index.json", "r+")

        decks_db = json.load(f1)
        cards_db = json.load(f2)
        id_index = json.load(f3)

        deck_id: int = id_index["decks"] + 1
        card_id: int = id_index["cards"] + 1

        new_deck.id = deck_id

        for card in new_deck.cards:
            card.id = card_id
            card.deck_id = deck_id
            card_id = card_id + 1

        f1.seek(0)
        f1.truncate()
        json.dump([*decks_db, {"id": new_deck.id, "name": new_deck.name}], f1, indent=2)

        f2.seek(0)
        f2.truncate()
        json.dump(
            [
                *cards_db,
                *[
                    {
                        "id": card.id,
                        "deck_id": card.deck_id,
                        "front": card.front,
                        "back": card.back,
                    }
                    for card in new_deck.cards
                ],
            ],
            f2,
            indent=2,
        )

        f3.seek(0)
        f3.truncate()
        json.dump({"decks": deck_id, "cards": card_id - 1}, f3, indent=2)

        return {"message": f"Successfully created a new deck with id {deck_id}"}
    except Exception as e:
        print(e)
        raise HTTPException(500, detail="Unknown error")
    finally:
        f1.close()
        f2.close()
        f3.close()


@router.post("/import")
def import_deck():
    raise HTTPException(501, detail="Not implemented")

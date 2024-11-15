export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface Deck {
  id: number;
  name: string;
  user_id: number;
  cards?: Flashcard[];
}

export interface AddDeckForm {
  onSuccess?: (data: unknown) => void;
  onError?: (e: unknown) => void;
}

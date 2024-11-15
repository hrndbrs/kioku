import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { deckSchema } from '@/lib/schemas';
import { fetcher } from '@/lib/utils';
import type { AddDeckForm, Flashcard } from '@/lib/types/components.type';

export default function AddDeckForm({
  onSuccess = () => {},
  onError = () => {},
}: AddDeckForm) {
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState<Omit<Flashcard, 'id'>[]>([
    { front: '', back: '' },
  ]);
  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCard = (idx: number) => {
    if (cards.length > 1) {
      setCards((c) => {
        const newSet = c.filter((_, i) => i !== idx);
        return newSet.length ? newSet : c;
      });
    }
  };

  const updateCard = (idx: number, field: 'front' | 'back', value: string) => {
    setCards((c) => {
      const newSet = structuredClone(c);
      newSet[idx][field] = value;
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDeck = deckSchema.parse({ name: deckName, cards });
      const data = await fetcher([
        '/decks',
        {
          method: 'POST',
          body: JSON.stringify(newDeck),
        },
      ]);
      onSuccess(data);
    } catch (e) {
      onError(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <Card className="py-4">
        <CardContent className="flex flex-col gap-1">
          <div className="space-y-2">
            <Label htmlFor="deckName">Deck Name</Label>
            <Input
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter deck name"
              required
            />
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            {cards.map((card, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`front-${card.front}`}>Front</Label>
                    <Input
                      id={`front-${card.front}`}
                      value={card.front}
                      onChange={(e) =>
                        updateCard(index, 'front', e.target.value)
                      }
                      placeholder="Enter the front of the card"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`back-${card.front}`}>Back</Label>
                    <Input
                      id={`back-${card.front}`}
                      value={card.back}
                      onChange={(e) =>
                        updateCard(index, 'back', e.target.value)
                      }
                      placeholder="Enter the back of the card"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full rounded-full"
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCard(index)}
                    disabled={cards.length === 1}
                  >
                    <span className="iconify size-5 lucide--trash-2" />
                    Remove Card
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-between gap-2 xs:flex-row">
          <Button
            className="w-full flex-1 rounded-full"
            type="button"
            variant="outline"
            onClick={addCard}
          >
            <span className="iconify size-5 lucide--plus-circle" />
            Add Card
          </Button>
          <Button className="w-full flex-1 rounded-full" type="submit">
            Create Deck
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

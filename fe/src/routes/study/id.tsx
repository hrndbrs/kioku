import React, { useState, useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Flashcard from '@/components/shared/Flashcard';
import { cn, shuffleArray } from '@/lib/utils';
import type { Deck } from '@/lib/types/components.type';

const DeckView: React.FC<Required<Deck>> = ({ name, cards }) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);

  const randomizedCards = useMemo(() => shuffleArray(cards), [isPracticing]);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handlePractice = () => {
    setIsPracticing(true);
    setCurrentCardIndex(0);
    setIsShowingAnswer(false);
  };

  const handleCloseModal = () => {
    setIsPracticing(false);
  };

  const handleShowAnswer = () => {
    setIsShowingAnswer(true);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsShowingAnswer(false);
    } else {
      setIsPracticing(false);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsShowingAnswer(false);
  };

  return (
    <>
      <Card className="mb-6">
        <Link to="/">
          <Button className="rounded-tr-lg" variant="ghost">
            <span className="iconify size-5 lucide--arrow-big-left-dash" />
            Go To List
          </Button>
        </Link>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-sm text-muted-foreground">
            This deck contains {cards.length} card
            {cards.length !== 1 ? 's' : ''}. Keep practicing to improve your
            mastery!
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handlePractice}
            className="w-full rounded-full sm:w-auto"
            size="lg"
          >
            <span className="iconify size-5 lucide--book-open" />
            Start Practice Session
          </Button>
        </CardFooter>
      </Card>

      <h2 className="mb-4 text-2xl font-bold">Cards in this Deck</h2>
      <ScrollArea className="h-[calc(100vh-400px)] pr-4">
        <div className="space-y-4">
          {cards.map((card, idx) => (
            <Card
              key={card.id}
              className="transition-all duration-200 ease-in-out hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {name} - {idx + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCard(card.id)}
                  aria-expanded={expandedCard === card.id}
                  aria-controls={`card-content-${card.id}`}
                >
                  <span
                    className={cn(
                      'iconify size-4 transition-transform duration-200 lucide--chevron-right',
                      expandedCard === card.id ? 'rotate-90' : '',
                    )}
                  />
                  <span className="sr-only">
                    {expandedCard === card.id ? 'Collapse' : 'Expand'}
                  </span>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-base font-medium">{card.front}</p>
                {expandedCard === card.id && (
                  <div
                    id={`card-content-${card.id}`}
                    className="mt-2 border-t pt-2 text-sm text-muted-foreground"
                  >
                    <p>{card.back}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isPracticing} onOpenChange={setIsPracticing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Practice Session - {name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Flashcard
              flippable={isShowingAnswer}
              front={randomizedCards[currentCardIndex].front}
              back={randomizedCards[currentCardIndex].back}
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-2">
            {!isShowingAnswer && (
              <Button onClick={handleShowAnswer} className="mt-2 sm:mt-0">
                Show Answer
              </Button>
            )}
            {isShowingAnswer && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={handleNextCard}
                  variant="destructive"
                  className="flex-1 rounded-full"
                >
                  <span className="iconify size-5 lucide--x" />
                  Hard
                </Button>
                <Button
                  onClick={handleNextCard}
                  className="flex-1 rounded-full"
                >
                  <span className="iconify size-5 lucide--check" />
                  Easy
                </Button>
              </div>
            )}
            <div className="flex space-x-2 sm:justify-end">
              <Button
                className="flex-1"
                onClick={handleRestart}
                variant="outline"
              >
                <span className="iconify size-5 lucide--rotate-ccw" />
                Restart
              </Button>
              <Button
                className="flex-1"
                onClick={handleCloseModal}
                variant="destructive"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function Study() {
  const deck = useLoaderData() as Required<Deck>;
  return <DeckView {...deck} />;
}

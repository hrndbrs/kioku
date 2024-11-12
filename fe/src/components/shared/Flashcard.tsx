import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/lib/types/components.type';

export default function Flashcard({
  front,
  back,
  flippable,
}: Omit<Flashcard, 'id' | 'deck_id'> & { flippable: boolean }) {
  const [showFront, setShowFront] = useState(true);
  function handleCardFlip() {
    if (flippable) setShowFront(!showFront);
  }

  useEffect(() => {
    setShowFront(true);
  }, [flippable]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative mx-auto h-48 w-80 [perspective:1000px]">
        <div
          onClick={handleCardFlip}
          className={cn(
            'absolute h-full w-full transition-all duration-500 [transform-style:preserve-3d]',
            flippable && showFront ? '[transform:rotateY(180deg)]' : '',
          )}
        >
          <Card className="absolute flex h-full w-full items-center justify-center bg-primary text-primary-foreground [backface-visibility:hidden]">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{front}</p>
            </CardContent>
          </Card>
          <Card className="absolute flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <CardContent className="pt-6">
              {flippable && <p className="text-xl">{back}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

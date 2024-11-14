import useSWR, { mutate } from 'swr';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddDeckForm from '@/components/shared/AddDeckForm';
import { fetcher } from '@/lib/utils';
import type { Deck } from '@/lib/types/components.type';
import { useRef } from 'react';
import { FetchError } from '@/lib/exceptions';

export default function Home() {
  const {
    data: decks,
    error,
    isLoading,
  } = useSWR(['/decks'], (...args) => fetcher<Deck[]>(...args));
  const dialogTrigger = useRef<HTMLButtonElement>(null);

  const { toast } = useToast();

  if (isLoading)
    return (
      <div className="flex h-svh flex-col items-center justify-center">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <span className="iconify mx-auto mb-4 size-12 animate-spin text-primary lucide--loader-2" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Loading decks...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your study materials.
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <span
            className="iconify mx-auto mb-6 size-16 text-red-500 lucide--alert-circle"
            aria-hidden="true"
          />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>
          <p className="mb-6 flex items-center justify-center text-lg text-gray-600">
            <span className="iconify mr-2 size-5 lucide--refresh-ccw" />
            Try refreshing your page
          </p>
        </div>
      </div>
    );

  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold">
        KIOKU <span className="text-lg font-bold">Flashcard App</span>
      </h1>
      <div>
        <div className="mb-4 grid items-center gap-2 xs:flex xs:justify-between">
          <h2 className="text-2xl font-semibold">Available Collections</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full" ref={dialogTrigger}>
                <span className="iconify size-4 lucide--plus-circle" /> Add Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[calc(100svh-2.5rem)]">
              <DialogHeader>
                <DialogTitle>Create A New Deck</DialogTitle>
              </DialogHeader>
              <ScrollArea>
                <AddDeckForm
                  onSuccess={() => {
                    mutate('/decks');
                    toast({
                      title: 'New Deck!',
                      description:
                        'You just added a new deck to learn from. Happy learning!',
                    });
                    dialogTrigger.current?.click();
                  }}
                  onError={(e) => {
                    if (e instanceof FetchError)
                      toast({
                        title: 'Whoops!',
                        description: e.message,
                        variant: 'destructive',
                      });
                  }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks?.map((deck, idx) => (
            <Card
              key={deck.id}
              className="relative transform overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader>
                <p className="text-sm font-semibold">Deck #{idx + 1}</p>
                <CardTitle>{deck.name}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link to={`/study/${deck.id}`} className="w-full">
                  <Button className="w-full rounded-full">Study Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

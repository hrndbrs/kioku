import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';
import { useSupportsHover } from '@/hooks/use-supports-hover';
import { useSession } from '@/contexts/session-context';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddDeckForm from '@/components/shared/AddDeckForm';
import { cn, fetcher } from '@/lib/utils';
import type { Deck } from '@/lib/types/components.type';
import { FetchError } from '@/lib/exceptions';

export default function Home() {
  const {
    data: decks,
    error,
    isLoading,
    mutate,
  } = useSWR(['/decks'], fetcher<Deck[]>, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const dialogTrigger = useRef<HTMLButtonElement>(null);
  const { session, logout } = useSession();
  const { toast } = useToast();
  const supportsHover = useSupportsHover();

  if (isLoading)
    return (
      <div className="flex h-svh flex-col items-center justify-center">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <span className="iconify mx-auto mb-4 size-12 animate-spin text-primary lucide--loader-2" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Loading decks...
          </h2>
          Please wait while we fetch your study materials.
          <p className="text-gray-600"></p>
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

  const handleTooltipOpenChange = (open: boolean, id: number) => {
    if (!supportsHover) return;

    if (open) {
      setOpenTooltipId(id);
    } else if (openTooltipId === id) {
      setOpenTooltipId(null);
    }
  };

  function showErrorToast(e: FetchError) {
    toast({
      title: 'Whoops!',
      description: e.message,
      variant: 'destructive',
    });
  }

  async function handleDelete(id: number) {
    try {
      const removedDeck = await fetcher<Deck>([
        `/decks/${id}`,
        { method: 'DELETE' },
      ]);

      await mutate();

      toast({
        title: 'Sayonara ╥﹏╥',
        description: (
          <>
            It was fun studying with you,{' '}
            <span className="font-bold">{removedDeck.name}</span>
          </>
        ),
      });
    } catch (e) {
      if (e instanceof FetchError) showErrorToast(e);
    } finally {
      setOpenTooltipId(null);
    }
  }

  function handleDeleteClick(id: number) {
    if (openTooltipId === id) {
      setOpenTooltipId(null);
    } else {
      setOpenTooltipId(id);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold">
        KIOKU <span className="text-lg font-bold">Flashcard App</span>
      </h1>
      <div>
        <div className="mb-4 grid items-center gap-2 xs:flex xs:justify-between">
          <h2 className="text-2xl font-semibold">Available Collections</h2>
          <div className="flex gap-2">
            {session.isLoggedIn ? (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full max-xs:flex-1"
                      ref={dialogTrigger}
                    >
                      <span className="iconify size-4 lucide--plus-circle" />{' '}
                      Add Deck
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-[calc(100svh-2.5rem)]">
                    <DialogHeader>
                      <DialogTitle>Create A New Deck</DialogTitle>
                    </DialogHeader>
                    <ScrollArea>
                      <AddDeckForm
                        onSuccess={async () => {
                          await mutate();
                          toast({
                            title: 'New Deck!',
                            description:
                              'You just added a new deck to learn from. Happy learning!',
                          });
                          dialogTrigger.current?.click();
                        }}
                        onError={(e) => {
                          if (e instanceof FetchError) showErrorToast(e);
                        }}
                      />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <Button
                  className="rounded-full transition-colors duration-200 hover:text-destructive max-xs:flex-1"
                  variant="ghost"
                  onClick={logout}
                >
                  <span className="iconify size-4 lucide--log-out" />
                  Log Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="max-xs:flex-1">
                <Button className="w-full rounded-full" variant="ghost">
                  <span className="iconify size-4 lucide--log-in" />
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks?.map((deck, idx) => (
            <Card
              key={deck.id}
              className="group relative transform transition-all duration-300 hover:z-50 hover:scale-105 hover:shadow-lg"
            >
              {session.isLoggedIn && session.user.id === deck.user_id ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip
                    open={openTooltipId === deck.id}
                    onOpenChange={(open) =>
                      handleTooltipOpenChange(open, deck.id)
                    }
                  >
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'absolute right-2 top-2 h-8 w-8 rounded-full text-destructive opacity-20 transition-all duration-200 hover:bg-destructive hover:text-neutral-50 group-hover:opacity-100',
                          openTooltipId === deck.id &&
                            'bg-destructive text-neutral-50 opacity-100',
                        )}
                        aria-label={'Delete deck ' + deck.name}
                        onClick={() => handleDeleteClick(deck.id)}
                      >
                        <span className="iconify size-4 lucide--trash" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="w-full max-w-xs px-5 py-4"
                    >
                      <div className="grid gap-2 text-center">
                        <p className="text-sm font-semibold">
                          Are you sure you want to delete this deck?
                        </p>
                        <p className="text-xs text-neutral-500">
                          (This action can't be undone)
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-1 rounded-full"
                          onClick={() => handleDelete(deck.id)}
                        >
                          Yes, I understand
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
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

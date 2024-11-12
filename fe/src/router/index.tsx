import { createBrowserRouter, redirect } from 'react-router-dom';
import RootLayout from '@/components/layouts/root.layout';
import Home from '@/routes';
import Study from '@/routes/study/id';
import NotFound from '@/routes/not-found';
import { fetcher } from '@/lib/utils';
import type { Deck } from '@/lib/types/components.type';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'study/:id',
        loader: async ({ params }) => {
          try {
            const { id } = params;
            const data = await fetcher<Deck>([`/decks/${id}`]);
            return data;
          } catch (e) {
            return redirect('/not-found');
          }
        },
        element: <Study />,
      },
    ],
  },
  {
    path: '/not-found',
    element: <NotFound />,
  },
  {
    path: '*',
    loader: () => redirect('/not-found'),
  },
]);

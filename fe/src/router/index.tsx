import { createBrowserRouter, redirect } from 'react-router-dom';
import RootLayout from '@/components/layouts/root.layout';
import ContentLayout from '@/components/layouts/content.layout';
import Home from '@/pages';
import Study from '@/pages/study/id';
import Auth from '@/pages/auth';
import NotFound from '@/pages/not-found';
import { fetcher } from '@/lib/utils';
import type { Deck } from '@/lib/types/components.type';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <ContentLayout />,
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
        path: '/auth',
        loader: () => {
          if (localStorage.getItem('access_token')) return redirect('/');
          return null;
        },
        element: <Auth />,
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

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSession } from '@/contexts/session-context';
import { fetcher } from '@/lib/utils';
import type { User } from '@/lib/schemas';

export default function ContentLayout() {
  const { setSession } = useSession();

  useEffect(() => {
    fetcher<User>(['/users/profile'])
      .then((user) => {
        setSession({
          isLoggedIn: true,
          user,
        });
      })
      .catch((_) => localStorage.removeItem('access_token'));
  }, []);

  return (
    <main className="container mx-auto min-h-screen px-6 py-5">
      <Outlet />
    </main>
  );
}

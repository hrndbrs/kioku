import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from '@/contexts/session-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Outlet />
      <Toaster />
    </SessionProvider>
  );
}

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout() {
  return (
    <>
      <main className="container mx-auto min-h-screen px-6 py-5">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setIsLoading(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-4 text-6xl font-bold"> 404 </h1>
        <p className="mb-8 text-2xl">
          Oops! This page seems to have gone on a journey.
        </p>

        <p className="mb-4">Let's return to a familiar territory</p>
        <Button asChild className="rounded-full">
          <Link to="/">
            <span className="iconify size-5 lucide--home" />
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

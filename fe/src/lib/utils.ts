import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FetchError } from './exceptions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async <T>([url, init]: [
  string,
  RequestInit?,
]): Promise<T> => {
  const res = await fetch(`${import.meta.env.VITE_BE_BASE_URL}${url}`, init);
  const data = await res.json();

  if (!res.ok) throw new FetchError(data, res.status);

  return data as T;
};

export function shuffleArray<T>(array: T[]): T[] {
  const arr = structuredClone(array);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

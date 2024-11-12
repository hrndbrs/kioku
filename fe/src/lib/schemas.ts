import { z } from 'zod';

export const cardSchema = z.object({
  id: z.number().optional().default(0),
  deck_id: z.number().optional().default(0),
  front: z.string().min(1),
  back: z.string().min(1),
});
export const deckSchema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1),
  cards: z.array(cardSchema).min(1),
});

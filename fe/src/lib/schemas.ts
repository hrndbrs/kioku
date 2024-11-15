import { z } from 'zod';

export const cardSchema = z.object({
  id: z.number().optional().default(0),
  deck_id: z.number().optional().default(0),
  front: z.string().min(1),
  back: z.string().min(1),
});
export const deckSchema = z.object({
  id: z.number().optional().default(0),
  user_id: z.number().optional().default(0),
  name: z.string().min(1),
  cards: z.array(cardSchema).min(1),
});
export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(4),
});
export const userSchema = loginSchema.extend({
  full_name: z.string().min(1),
  profile_pic: z.string().optional().default(''),
});
export const registrationSchema = userSchema.extend({
  password: z.string().min(4),
});

export type Session =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      user: User;
    };

export type LoginResponse = {
  access_token: string;
};
export type User = z.infer<typeof userSchema> & { id: number };
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegistrationSchema = z.infer<typeof registrationSchema>;

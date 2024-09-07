import { z } from 'zod';
import { baseAuthSchema } from './signup-auth.dto';

export const signInSchema = baseAuthSchema.pick({
  email: true,
  password: true,
});

export type SignInAuthDto = z.infer<typeof signInSchema>;

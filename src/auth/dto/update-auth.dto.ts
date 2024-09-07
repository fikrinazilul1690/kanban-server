import { z } from 'zod';
import { baseAuthSchema } from './signup-auth.dto';

export const updateAuthSchema = baseAuthSchema
  .omit({ confirmPassword: true })
  .partial();

export type UpdateAuthDto = z.infer<typeof updateAuthSchema>;

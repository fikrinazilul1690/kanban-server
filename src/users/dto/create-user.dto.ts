import { baseAuthSchema } from 'src/auth/dto/signup-auth.dto';
import { z } from 'zod';

export const createUserSchema = baseAuthSchema.omit({ confirmPassword: true });

export type CreateUserDto = z.infer<typeof createUserSchema>;

import { z } from 'zod';

export const createSessionSchema = z.object({
  id: z.string().cuid2(),
  refreshToken: z.string(),
  userId: z.bigint(),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;

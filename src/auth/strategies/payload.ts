import { z } from 'zod';

export const payloadSchema = z.object({
  sub: z.coerce.bigint(),
  sessionId: z.string().cuid2().optional(),
  email: z.string().email(),
});

export type JWTPayload = z.infer<typeof payloadSchema>;
export type RefreshPayload = {
  refreshToken: string;
} & JWTPayload;

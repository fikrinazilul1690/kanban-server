import { z } from 'zod';

export const refreshTokenSchema = z.object({
  userId: z.coerce.bigint(),
  sessionId: z.string().cuid2(),
  refreshToken: z.string().min(1, { message: 'Required' }),
});

export const refreshAuthSchema = refreshTokenSchema.pick({
  refreshToken: true,
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export type RefreshAuthDto = z.infer<typeof refreshAuthSchema>;

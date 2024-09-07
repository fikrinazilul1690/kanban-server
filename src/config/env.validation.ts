import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  JWT_ACCESS_SECRET: z.coerce.string(),
  JWT_REFRESH_SECRET: z.coerce.string(),
});

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): Record<string, any> {
  return envSchema.parse(config);
}

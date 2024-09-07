import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const findOneQuerySchema = z
  .object({
    projectId: bigIntSchema,
    projectSlug: z.string(),
  })
  .partial();

export type FindOneQueryParams = z.infer<typeof findOneQuerySchema>;

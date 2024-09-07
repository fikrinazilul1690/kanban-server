import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const findStatusesSchema = z.object({
  projectId: bigIntSchema,
});

export type FindTaskStatusesDto = z.infer<typeof findStatusesSchema>;

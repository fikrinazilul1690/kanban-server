import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const queryProjectsSchema = z.object({
  userId: bigIntSchema.optional(),
});

export type QueryProjectsDto = z.infer<typeof queryProjectsSchema>;

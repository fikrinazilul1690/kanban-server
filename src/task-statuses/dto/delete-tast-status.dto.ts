import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const deleteStatusSchema = z.object({
  moveTo: bigIntSchema,
});

export type DeleteStatusQueryParams = z.infer<typeof deleteStatusSchema>;

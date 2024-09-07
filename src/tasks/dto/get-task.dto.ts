import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const getTaskSchema = z.object({
  statusId: bigIntSchema,
});

export type GetTaskDto = z.infer<typeof getTaskSchema>;

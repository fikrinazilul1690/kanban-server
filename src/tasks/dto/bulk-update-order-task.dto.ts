import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const bulkUpdateOrderTaskSchema = z.object({
  bulkTasks: z.array(bigIntSchema),
  projectId: bigIntSchema,
  statusId: bigIntSchema,
});

export type BulkUpdateOrderTaskDto = z.infer<typeof bulkUpdateOrderTaskSchema>;

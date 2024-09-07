import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const bulkUpdateOrderStatusesSchema = z.object({
  bulkTaskStatuses: z
    .array(
      z.object({
        order: z.number().gt(0),
        statusId: bigIntSchema,
      }),
    )
    .min(2),
  projectId: bigIntSchema,
});

export type BulkUpdateOrderStatusesDto = z.infer<
  typeof bulkUpdateOrderStatusesSchema
>;

import { z } from 'zod';
import { createStatusSchema } from './create-task-status.dto';

export const updateStatusSchema = createStatusSchema
  .omit({ projectId: true })
  .partial();

export type UpdateTaskStatusDto = z.infer<typeof updateStatusSchema>;

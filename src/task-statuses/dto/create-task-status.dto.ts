import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const createStatusSchema = z.object({
  projectId: bigIntSchema,
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{3,6}[0-9a-f]{0,2}$/i),
  isClosed: z.boolean().optional(),
});

export type CreateTaskStatusDto = z.infer<typeof createStatusSchema>;

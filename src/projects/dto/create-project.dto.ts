import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3),
  icon: z.string().emoji().optional(),
  description: z.string().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

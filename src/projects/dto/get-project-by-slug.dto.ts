import { z } from 'zod';

export const getProjectBySlugSchema = z.object({
  slug: z.string().min(1),
});

export type GetProjectBySlugDto = z.infer<typeof getProjectBySlugSchema>;

import { bigIntSchema } from 'src/types';
import { z } from 'zod';

const role = z.enum(['Owner', 'Admin', 'Member']);

export const createMemberSchema = z.object({
  userId: bigIntSchema,
  projectId: bigIntSchema,
  role,
});

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
export type Role = z.infer<typeof role>;

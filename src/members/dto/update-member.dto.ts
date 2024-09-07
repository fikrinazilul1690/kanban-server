import { z } from 'zod';
import { createMemberSchema } from './create-member.dto';

export const updateMemberSchema = createMemberSchema.pick({ role: true });

export type UpdateMemberDto = z.infer<typeof updateMemberSchema>;

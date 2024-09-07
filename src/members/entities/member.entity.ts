import { MemberOnProject } from '@prisma/client';

export class Member implements MemberOnProject {
  id: bigint = BigInt(0);
  userId: bigint = BigInt(0);
  name: string = '';
  email: string = '';
  projectId: bigint = BigInt(0);
  role: string = '';

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}

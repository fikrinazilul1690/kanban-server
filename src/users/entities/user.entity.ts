import { Exclude } from 'class-transformer';
import { User as UserEntity } from '@prisma/client';
export class User implements UserEntity {
  id: bigint = BigInt(0);
  name: string = '';
  email: string = '';

  @Exclude()
  password: string = '';
  createdAt: Date = new Date(NaN);

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

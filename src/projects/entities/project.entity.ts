import { Project as ProjectEntity } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class Project implements ProjectEntity {
  id: bigint = BigInt(0);
  title: string = '';
  icon: string = '';
  slug: string = '';
  description: string | null = null;
  @Exclude()
  ownerId: bigint = BigInt(0);

  createdAt: Date = new Date(NaN);
  updateAt: Date = new Date(NaN);
  @Type(() => User)
  owner?: User = undefined;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}

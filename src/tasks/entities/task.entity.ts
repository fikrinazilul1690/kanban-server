import { Task as TaskEntity } from '@prisma/client';
import { Type } from 'class-transformer';
import { TaskStatus } from 'src/task-statuses/entities/task-status.entity';

export class Task implements TaskEntity {
  id: bigint = BigInt(0);
  subject: string = '';
  description: string | null = null;
  order: number = 0;
  statusId: bigint = BigInt(0);
  projectId: bigint = BigInt(0);
  createdAt: Date = new Date(NaN);
  updatedAt: Date = new Date(NaN);

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}

export class TaskWithStatus extends Task {
  @Type(() => TaskStatus)
  status: TaskStatus = new TaskStatus({});
  constructor(partial: Partial<Task>) {
    super(partial);
    Object.assign(this, partial);
  }
}

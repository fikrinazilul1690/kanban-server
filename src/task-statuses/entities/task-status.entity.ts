import { Status } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { Task } from 'src/tasks/entities/task.entity';

export class TaskStatus implements Status {
  id: bigint = BigInt(0);
  name: string = '';
  slug: string = '';
  @Exclude()
  defaultSlug: string | null = null;
  order: number = 0;
  color: string = '';
  isClosed: boolean = false;
  projectId: bigint = BigInt(0);

  constructor(partial: Partial<TaskStatus>) {
    Object.assign(this, partial);
  }
}

export class TaskStatusWithTasks extends TaskStatus {
  @Type(() => Task)
  tasks: Task[] = [];

  constructor(partial: Partial<TaskStatusWithTasks>) {
    super(partial);
    Object.assign(this, partial);
  }
}

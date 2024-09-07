import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskStatusesModule } from 'src/task-statuses/task-statuses.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule, TaskStatusesModule],
})
export class TasksModule {}

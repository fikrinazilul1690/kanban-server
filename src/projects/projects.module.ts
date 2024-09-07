import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskStatusesModule } from 'src/task-statuses/task-statuses.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [PrismaModule, TaskStatusesModule, UsersModule],
})
export class ProjectsModule {}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskStatusesService } from 'src/task-statuses/task-statuses.service';
import { BulkUpdateOrderTaskDto } from './dto/bulk-update-order-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly statusService: TaskStatusesService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    return this.prismaService.$transaction(async (tx) => {
      let statusId: bigint;
      if (!!createTaskDto.statusId) {
        statusId = createTaskDto.statusId;
      } else {
        const status = await tx.status.findUniqueOrThrow({
          where: {
            defaultSlug_projectId: {
              projectId: createTaskDto.projectId,
              defaultSlug: 'new',
            },
          },
          select: {
            id: true,
          },
        });

        statusId = status.id;
      }
      return tx.task.create({
        data: {
          ...createTaskDto,
          statusId,
        },
      });
    });
  }

  findAll(statusId: bigint) {
    return this.prismaService.status
      .findUniqueOrThrow({ where: { id: statusId } })
      .tasks();
  }

  findOne(unique: Prisma.TaskWhereUniqueInput) {
    return this.prismaService.task.findUniqueOrThrow({
      where: { ...unique },
      include: {
        status: true,
      },
    });
  }

  async update(id: bigint, updateTaskDto: UpdateTaskDto) {
    let order: number | undefined = undefined;
    const task = await this.findOne({ id });
    if (!task) {
      throw new NotFoundException(`task with id:${id} not found`);
    }

    if (!!updateTaskDto.statusId) {
      const destinationStatus = await this.statusService.findOne({
        id: updateTaskDto.statusId,
      });

      if (destinationStatus) {
        const isSameProject = task.projectId === destinationStatus.projectId;
        if (!isSameProject) {
          throw new UnprocessableEntityException(
            "can't update task status from different project",
          );
        }

        console.log('get nextval');

        order = await this.nextOrderSequence();
      }
    }

    return await this.prismaService.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        order,
      },
    });
  }

  async nextOrderSequence() {
    const data = await this.prismaService.$queryRaw<
      {
        nextval: number;
      }[]
    >`SELECT nextval(pg_get_serial_sequence('tasks', 'order'))::int`;
    return data[0].nextval;
  }

  async bulkUpdateOrder(bulkUpdateOrderTaskDto: BulkUpdateOrderTaskDto) {
    const { statusId, bulkTasks, projectId } = bulkUpdateOrderTaskDto;
    const tasksCount = await this.prismaService.task.count({
      where: {
        projectId: bulkUpdateOrderTaskDto.projectId,
        OR: [
          {
            statusId: bulkUpdateOrderTaskDto.statusId,
          },
          {
            id: {
              in: bulkUpdateOrderTaskDto.bulkTasks,
            },
          },
        ],
      },
    });

    if (tasksCount !== bulkTasks.length) {
      throw new BadRequestException([
        {
          field: 'bulkTasks',
          message: `validation vailed!, this happened because some provided IDs were not found or the provided IDs' length was not equal to ${tasksCount}`,
        },
      ]);
    }

    const queries = bulkTasks.map(
      (id, index) =>
        this.prismaService
          .$executeRaw`UPDATE "tasks" SET "order" = ${index + 1}, "statusId" = ${statusId} WHERE "id" = ${id} AND "projectId" = ${projectId}`,
    );

    await this.prismaService.$transaction(queries);
  }

  remove(id: bigint) {
    return this.prismaService.task.delete({ where: { id } });
  }
}

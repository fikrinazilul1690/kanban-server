import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateUniqueSlugify } from 'src/common/utils/slugify.util';
import { BulkUpdateOrderStatusesDto } from './dto/bulk-update-order-statuses.dto';

@Injectable()
export class TaskStatusesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTaskStatusDto: CreateTaskStatusDto) {
    const slug = await this.generateSlug(createTaskStatusDto.name);
    return await this.prismaService.status.create({
      data: { ...createTaskStatusDto, slug },
    });
  }

  async findAll(projectId: bigint) {
    return await this.prismaService.project
      .findUniqueOrThrow({ where: { id: projectId } })
      .statuses({
        include: {
          tasks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: { order: 'asc' },
      });
  }

  findOne(unique: Prisma.StatusWhereUniqueInput) {
    return this.prismaService.status.findUnique({ where: { ...unique } });
  }

  async update(id: bigint, updateTaskStatusDto: UpdateTaskStatusDto) {
    console.log(updateTaskStatusDto.isClosed);
    let slug: string | undefined = undefined;
    let color = updateTaskStatusDto.color;
    if (!!updateTaskStatusDto?.name) {
      slug = await this.generateSlug(updateTaskStatusDto.name);
    }
    return await this.prismaService.$transaction(async (tx) => {
      const currStatus = await tx.status.findUnique({
        where: { id },
        select: { color: true },
      });
      if (currStatus?.color === color) {
        color = undefined;
      }
      return await tx.status.update({
        where: { id },
        data: { ...updateTaskStatusDto, slug, color },
      });
    });
  }

  async remove(id: bigint, moveTo: bigint) {
    return this.prismaService.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: { statusId: id },
        data: {
          statusId: moveTo,
        },
      });

      const { defaultSlug } = await tx.status.delete({
        where: { id },
        select: { defaultSlug: true },
      });
      if (defaultSlug === 'new') {
        await tx.status.update({
          where: { id: moveTo },
          data: {
            defaultSlug,
          },
        });
      }
    });
  }

  async bulkUpdateOrder(
    bulkUpdateOrderStatusesDto: BulkUpdateOrderStatusesDto,
  ) {
    const { bulkTaskStatuses, projectId } = bulkUpdateOrderStatusesDto;
    console.log(bulkTaskStatuses);
    const countStatuses = await this.prismaService.status.count({
      where: { projectId },
    });

    if (countStatuses !== bulkTaskStatuses.length) {
      throw new BadRequestException([
        {
          field: 'bulkTaskStatuses',
          message: `bulkTaskStatuses length must equal to ${countStatuses}`,
        },
      ]);
    }

    const queries = bulkTaskStatuses.map(
      ({ order, statusId }) =>
        this.prismaService
          .$executeRaw`UPDATE "statuses" SET "order" = ${order} WHERE "id" = ${statusId} AND "projectId" = ${projectId}`,
    );

    await this.prismaService.$transaction(queries);
  }

  private async generateSlug(str: string): Promise<string> {
    return await generateUniqueSlugify(str, (potential: string) => {
      return this.prismaService.status.findMany({
        where: { slug: { contains: potential } },
        select: {
          slug: true,
        },
      });
    });
  }

  getDefault(): Array<Prisma.StatusCreateManyProjectInput> {
    return [
      {
        name: 'New',
        slug: 'new',
        defaultSlug: 'new',
        color: '#A9AABC',
      },
      {
        name: 'Ready',
        slug: 'ready',
        defaultSlug: 'ready',
        color: '#E44057',
      },
      {
        name: 'In progress',
        slug: 'in-progress',
        defaultSlug: 'in-progress',
        color: '#E47C40',
      },
      {
        name: 'Ready for test',
        slug: 'ready-for-test',
        defaultSlug: 'ready-for-test',
        color: '#E4CE40',
      },
      {
        name: 'Done',
        slug: 'done',
        defaultSlug: 'done',
        isClosed: true,
        color: '#A8E440',
      },
    ];
  }
}

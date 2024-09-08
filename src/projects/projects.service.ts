import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateUniqueSlugify } from 'src/common/utils/slugify.util';
import { TaskStatusesService } from 'src/task-statuses/task-statuses.service';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly taskStatusesService: TaskStatusesService,
  ) {}
  async create(userId: bigint, createProjectDto: CreateProjectDto) {
    const user = await this.userService.findOne({ id: userId });
    if (!user) throw new UnauthorizedException('Acess Denied');
    const slug = await this.generateSlug(createProjectDto.title);
    return await this.prismaService.project.create({
      data: {
        ...createProjectDto,
        slug,
        ownerId: userId,
        statuses: {
          createMany: { data: this.taskStatusesService.getDefault() },
        },
        members: {
          create: {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: 'Owner',
          },
        },
      },
      include: {
        owner: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithAggregationInput;
  }) {
    return this.prismaService.project.findMany(params);
  }

  findOne(unique: Prisma.ProjectWhereUniqueInput) {
    return this.prismaService.project.findUniqueOrThrow({
      where: unique,
      include: {
        owner: true,
      },
    });
  }

  async update(id: bigint, updateProjectDto: UpdateProjectDto) {
    let slug: string | undefined = undefined;
    if (!!updateProjectDto?.title) {
      slug = await this.generateSlug(updateProjectDto.title);
    }
    return await this.prismaService.project.update({
      data: {
        ...updateProjectDto,
        slug,
      },
      where: { id },
    });
  }

  async remove(userId: bigint, id: bigint) {
    return this.prismaService.$transaction(async (tx) => {
      const project = await tx.project.findUniqueOrThrow({
        where: { id },
      });
      if (userId !== project.ownerId) {
        throw new ForbiddenException(
          "you don't have permission to perform this action.",
        );
      }

      return await tx.project.delete({ where: { id: project.id } });
    });
  }

  private async generateSlug(str: string): Promise<string> {
    return await generateUniqueSlugify(str, (potential: string) => {
      return this.prismaService.project.findMany({
        where: { slug: { contains: potential } },
        select: {
          slug: true,
        },
      });
    });
  }
}

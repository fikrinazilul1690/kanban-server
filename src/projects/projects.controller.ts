import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  createProjectSchema,
} from './dto/create-project.dto';
import {
  UpdateProjectDto,
  updateProjectSchema,
} from './dto/update-project.dto';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { BigIntIDParams, bigIntIDParamsSchema } from 'src/types';
import { Project } from './entities/project.entity';
import {
  GetProjectBySlugDto,
  getProjectBySlugSchema,
} from './dto/get-project-by-slug.dto';
import { plainToInstance } from 'class-transformer';
import {
  QueryProjectsDto,
  queryProjectsSchema,
} from './dto/query-projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProjectSchema))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const userId = req.user!.sub;
    return plainToInstance(
      Project,
      await this.projectsService.create(userId, createProjectDto),
    );
  }

  @Get()
  @UsePipes(new ZodValidationPipe(queryProjectsSchema))
  async findAll(@Query() { userId }: QueryProjectsDto) {
    return (
      await this.projectsService.findAll({
        where: { members: { every: { userId } } },
      })
    ).map((val) => new Project(val));
  }

  @Get('by-slug')
  @UsePipes(new ZodValidationPipe(getProjectBySlugSchema))
  async findOneBySlug(@Query() { slug }: GetProjectBySlugDto) {
    return plainToInstance(
      Project,
      await this.projectsService.findOne({ slug }),
    );
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(bigIntIDParamsSchema))
  async findOne(@Param() { id }: BigIntIDParams) {
    return plainToInstance(Project, await this.projectsService.findOne({ id }));
  }

  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Body(new ZodValidationPipe(updateProjectSchema))
    updateProjectDto: UpdateProjectDto,
  ) {
    return plainToInstance(
      Project,
      await this.projectsService.update(id, updateProjectDto),
    );
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(bigIntIDParamsSchema))
  async remove(@Param() { id }: BigIntIDParams, @Req() req: Request) {
    const userId = req.user!.sub;
    return plainToInstance(
      Project,
      await this.projectsService.remove(userId, id),
    );
  }
}

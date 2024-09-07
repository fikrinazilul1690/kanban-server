import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskStatusesService } from './task-statuses.service';
import {
  CreateTaskStatusDto,
  createStatusSchema,
} from './dto/create-task-status.dto';
import {
  UpdateTaskStatusDto,
  updateStatusSchema,
} from './dto/update-task-status.dto';
import { BigIntIDParams, bigIntIDParamsSchema } from 'src/types';
import {
  FindTaskStatusesDto,
  findStatusesSchema,
} from './dto/find-task-statuses.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { plainToInstance } from 'class-transformer';
import { TaskStatus, TaskStatusWithTasks } from './entities/task-status.entity';
import {
  BulkUpdateOrderStatusesDto,
  bulkUpdateOrderStatusesSchema,
} from './dto/bulk-update-order-statuses.dto';
import {
  DeleteStatusQueryParams,
  deleteStatusSchema,
} from './dto/delete-tast-status.dto';
import {
  FindOneQueryParams,
  findOneQuerySchema,
} from './dto/find-one-query.dto';

@Controller('task-statuses')
export class TaskStatusesController {
  constructor(private readonly taskStatusesService: TaskStatusesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createStatusSchema))
  async create(@Body() createTaskStatusDto: CreateTaskStatusDto) {
    return plainToInstance(
      TaskStatus,
      await this.taskStatusesService.create(createTaskStatusDto),
    );
  }

  @Get()
  @UsePipes(new ZodValidationPipe(findStatusesSchema))
  async findAll(@Query() { projectId }: FindTaskStatusesDto) {
    const statuses = await this.taskStatusesService.findAll(projectId);
    return plainToInstance(TaskStatusWithTasks, statuses);
  }

  @Get(':id')
  async findOne(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Query(new ZodValidationPipe(findOneQuerySchema))
    { projectId, projectSlug }: FindOneQueryParams,
  ) {
    const task = await this.taskStatusesService.findOne({
      id,
      projectId,
      project: {
        slug: projectSlug,
      },
    });

    return plainToInstance(TaskStatus, task);
  }

  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Body(new ZodValidationPipe(updateStatusSchema))
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return plainToInstance(
      TaskStatus,
      await this.taskStatusesService.update(id, updateTaskStatusDto),
    );
  }

  @Post('bulk-order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(bulkUpdateOrderStatusesSchema))
  bulkUpdateOrder(
    @Body() bulkUpdateOrderStatusesDto: BulkUpdateOrderStatusesDto,
  ) {
    return this.taskStatusesService.bulkUpdateOrder(bulkUpdateOrderStatusesDto);
  }
  @Delete(':id')
  async remove(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Query(new ZodValidationPipe(deleteStatusSchema))
    { moveTo }: DeleteStatusQueryParams,
  ) {
    return plainToInstance(
      TaskStatus,
      await this.taskStatusesService.remove(id, moveTo),
    );
  }
}

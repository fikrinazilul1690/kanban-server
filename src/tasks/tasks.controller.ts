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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { BigIntIDParams, bigIntIDParamsSchema } from 'src/types';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { GetTaskDto, getTaskSchema } from './dto/get-task.dto';
import {
  BulkUpdateOrderTaskDto,
  bulkUpdateOrderTaskSchema,
} from './dto/bulk-update-order-task.dto';
import {
  findOneQuerySchema,
  FindOneQueryParams,
} from './dto/find-one-query.dto';
import { TaskWithStatus } from './entities/task.entity';
import { plainToInstance } from 'class-transformer';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(getTaskSchema))
  findAll(@Query() { statusId }: GetTaskDto) {
    return this.tasksService.findAll(statusId);
  }

  @Get(':id')
  async findOne(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Query(new ZodValidationPipe(findOneQuerySchema))
    { projectId, projectSlug }: FindOneQueryParams,
  ) {
    const task = await this.tasksService.findOne({
      id,
      projectId,
      project: {
        slug: projectSlug,
      },
    });

    return plainToInstance(TaskWithStatus, task);
  }

  @Post('bulk-order')
  @UsePipes(new ZodValidationPipe(bulkUpdateOrderTaskSchema))
  bulkOrder(@Body() bulkUpdateOrderTaskDto: BulkUpdateOrderTaskDto) {
    return this.tasksService.bulkUpdateOrder(bulkUpdateOrderTaskDto);
  }

  @Patch(':id')
  update(
    @Param(new ZodValidationPipe(bigIntIDParamsSchema)) { id }: BigIntIDParams,
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(bigIntIDParamsSchema))
  remove(@Param() { id }: BigIntIDParams) {
    return this.tasksService.remove(id);
  }
}

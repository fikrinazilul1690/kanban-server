import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import formatZodErrors from '../utils/format-zod-error.util';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    const parsedValue = this.schema.safeParse(value);
    if (!parsedValue.success) {
      throw new BadRequestException(formatZodErrors(parsedValue.error));
    }
    return parsedValue.data;
  }
}

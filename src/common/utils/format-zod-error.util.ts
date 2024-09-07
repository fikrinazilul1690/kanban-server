import { ZodError } from 'zod';

export default function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

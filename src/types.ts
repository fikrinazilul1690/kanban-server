import { z } from 'zod';

export type ErrorResponse = {
  message: string;
  timestamp: string;
  path: string;
  details: object | string;
};

export const bigIntSchema = z.string().transform((value, ctx) => {
  try {
    return BigInt(value);
  } catch (error) {
    ctx.addIssue({
      code: 'invalid_type',
      expected: 'bigint',
      received: 'nan',
      message: `The provided string is not a number`,
    });
    return BigInt(0);
  }
});

export const bigIntIDParamsSchema = z.object({
  id: bigIntSchema,
});

export type BigIntIDParams = z.infer<typeof bigIntIDParamsSchema>;

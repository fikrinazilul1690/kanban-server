import { z } from 'zod';

export const baseAuthSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .trim()
    .min(8)
    .refine((val) => !val.includes(' '), {
      message: 'Password cannot contain space',
    }),
  confirmPassword: z.string().trim(),
});

export const signUpSchema = baseAuthSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Password don't match",
    path: ['confirmPassword'],
  },
);

export type SignUpAuthDto = z.infer<typeof signUpSchema>;

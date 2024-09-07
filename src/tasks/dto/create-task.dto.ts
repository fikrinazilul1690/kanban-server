import * as sanitizeHtml from 'sanitize-html';
import { bigIntSchema } from 'src/types';
import { z } from 'zod';

export const baseTaskSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1).optional(),
  statusId: bigIntSchema.optional(),
  projectId: bigIntSchema,
});

export const createTaskSchema = baseTaskSchema.transform((v) => {
  if (v.description) {
    return {
      ...v,
      description: sanitizeHtml(v.description, {
        allowedAttributes: {
          '*': ['style', 'data-*'],
        },
        allowedStyles: {
          '*': {
            // Match HEX and RGB
            color: [
              /^#(0x)?[0-9a-f]+$/i,
              /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
            ],
            'text-align': [/^left$/, /^right$/, /^center$/],
            // Match any number with px, em, or %
            'font-size': [/^\d+(?:px|em|%)$/],
          },
        },
      }),
    };
  }
  return v;
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

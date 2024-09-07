import * as sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { baseTaskSchema } from './create-task.dto';

export const updateTaskSchema = baseTaskSchema
  .omit({ projectId: true })
  .partial()
  .transform((v) => {
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

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

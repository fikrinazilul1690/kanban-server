import { Prisma } from '@prisma/client';

type PrismaErrorMeta = {
  modelName: string;
  target?: Array<string>;
  field_name?: string;
  message?: string;
};

export default function formatPrismaErrors(
  error: Prisma.PrismaClientKnownRequestError,
) {
  if (error.meta) {
    const meta = error.meta as PrismaErrorMeta;
    console.log(meta);

    if (meta.target) {
      return meta.target.map((field) => ({
        field,
        message: getMessage(error.code, field),
      }));
    }

    if (meta.field_name) {
      const split = meta.field_name.split('_');
      const field = split[split.length > 1 ? 1 : 0];
      return [
        {
          field,
          message: getMessage(error.code, field),
        },
      ];
    }

    if (meta.message) {
      return meta.message.replace(/\"/g, '');
    }
  }

  return 'An unexpected error occurred.';
}

function getMessage(code: string, field: string): string {
  switch (code) {
    case 'P2002':
      return `${field} already exist`;
    case 'P2003':
      return `${field} does not exist`;
    default:
      return 'An unexpected error occurred.';
  }
}

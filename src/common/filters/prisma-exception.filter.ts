import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Record } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';
import { ErrorResponse } from 'src/types';
import formatPrismaErrors from '../utils/format-prisma-error.util';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorMap = PrismaErrorMap[exception.code];

    console.log(exception);

    if (!errorMap) {
      super.catch(exception, host);
      return;
    }

    const { code: statusCode, message } = errorMap;

    const errorResponse: {
      statusCode: number;
      status: string;
      error: ErrorResponse;
    } = {
      statusCode,
      status: getReasonPhrase(statusCode),
      error: {
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: formatPrismaErrors(exception),
      },
    };

    response.status(statusCode).json(errorResponse);
  }
}

const PrismaErrorMap: Record<string, { code: number; message: string }> = {
  P2002: {
    code: HttpStatus.CONFLICT,
    message:
      'The request could not be completed due to a conflict with the current state of the resource.',
  },
  P2003: {
    code: HttpStatus.CONFLICT,
    message:
      'The request could not be completed due to a conflict with the current state of the resource.',
  },
  P2010: {
    code: HttpStatus.CONFLICT,
    message:
      'The request could not be completed due to a conflict with the current state of the resource.',
  },
  P2025: {
    code: HttpStatus.NOT_FOUND,
    message: 'The requested resource was not found',
  },
};

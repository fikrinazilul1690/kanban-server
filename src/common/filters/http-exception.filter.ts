import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';
import { ErrorResponse } from 'src/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: {
      statusCode: number;
      status: string;
      error: ErrorResponse;
    } = {
      statusCode: status,
      status: getReasonPhrase(status),
      error: {
        message:
          'The request could not be completed due to an error with the current state of the resource.',
        timestamp: new Date().toISOString(),
        path: request.url,
        details: 'An unexpected error occurred.',
      },
    };

    if (exception instanceof BadRequestException) {
      errorResponse = {
        ...errorResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        error: {
          ...errorResponse.error,
          message: 'Validation failed',
          details: exception.getResponse()['message'] || exception.message,
        },
      };
    } else if (exception instanceof HttpException) {
      errorResponse = {
        ...errorResponse,
        error: {
          ...errorResponse.error,
          details: exception.getResponse()['message'] || exception.message,
        },
      };
    }

    response.status(status).json(errorResponse);
  }
}

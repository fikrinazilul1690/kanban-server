import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { getReasonPhrase } from 'http-status-codes';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = response.statusCode;
    const status = getReasonPhrase(statusCode);
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
    return {
      status,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: res,
    };
  }
}

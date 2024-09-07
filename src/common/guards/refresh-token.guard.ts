import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { refreshAuthSchema } from 'src/auth/dto/refresh-auth.dto';
import formatZodErrors from '../utils/format-zod-error.util';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const parsedBody = refreshAuthSchema.safeParse(request.body);
    if (!parsedBody.success) {
      throw new BadRequestException(formatZodErrors(parsedBody.error));
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: { message: any }) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}

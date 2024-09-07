import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/config/env.validation';
import { Request } from 'express';
import { RefreshPayload, payloadSchema } from './payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): RefreshPayload {
    const refreshToken = req.body.refreshToken as string;
    const parsedPayload = payloadSchema.safeParse(payload);
    if (!parsedPayload.success) {
      throw new UnauthorizedException('invalid token');
    }
    return {
      ...parsedPayload.data,
      refreshToken,
    };
  }
}

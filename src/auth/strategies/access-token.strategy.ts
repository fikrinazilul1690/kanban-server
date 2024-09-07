import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/config/env.validation';
import { JWTPayload, payloadSchema } from './payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: true,
    });
  }

  validate(payload: any): JWTPayload {
    const parsedPayload = payloadSchema.safeParse(payload);
    if (!parsedPayload.success) {
      throw new UnauthorizedException('invalid token');
    }
    return parsedPayload.data;
  }
}

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.validation';
import * as argon2 from 'argon2';
import { Auth } from './entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import { createUserSchema } from 'src/users/dto/create-user.dto';
import { createId } from '@paralleldrive/cuid2';
import { SessionService } from 'src/session/session.service';
import { createSessionSchema } from 'src/session/dto/create-session.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { RefreshTokenDto } from './dto/refresh-auth.dto';
import { ZodError } from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
  ) {}
  async signUp(signUpAuthDto: SignUpAuthDto): Promise<Auth> {
    const password = await this.hashData(signUpAuthDto.password);
    const user = await this.userService.create({
      ...createUserSchema.parse(signUpAuthDto),
      password,
    });

    const sessionId = createId();

    const tokens = await this.getTokens(
      user.id.toString(),
      sessionId,
      user.email,
    );

    await this.saveSession(sessionId, tokens.refreshToken, user.id);

    return { ...tokens, user };
  }

  async signIn(signInDto: SignInAuthDto): Promise<Auth> {
    const { email, password } = signInDto;
    const user = await this.userService.findOne({
      email,
    });

    if (!user) throw new UnauthorizedException('Wrong credentials');

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) throw new UnauthorizedException('Wrong credentials');

    const sessionId = createId();
    const tokens = await this.getTokens(
      user.id.toString(),
      sessionId,
      user.email,
    );

    await this.saveSession(sessionId, tokens.refreshToken, user.id);

    return { ...tokens, user };
  }

  async revokeToken(sessionId: string) {
    try {
      await this.sessionService.revoke(sessionId);
    } catch (error) {
      console.log(error);
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { sessionId, userId, refreshToken } = refreshTokenDto;
    const session = await this.sessionService.findOne(sessionId);

    if (!session) throw new UnauthorizedException('Access Denied');

    // detect refresh token reused
    if (session.isRevoke) {
      await this.deleteSession(userId);
      throw new UnauthorizedException('Refresh token has been reused');
    }

    const refreshTokenMatches = await argon2.verify(
      session.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    await this.revokeToken(session.id);

    const newSessionId = createId();

    const tokens = await this.getTokens(
      userId.toString(),
      newSessionId,
      session.user.email,
    );

    await this.saveSession(newSessionId, tokens.refreshToken, session.userId);

    return { ...tokens, user: session.user };
  }

  private hashData(data: string) {
    return argon2.hash(data);
  }

  private async deleteSession(userId: bigint): Promise<void> {
    try {
      await this.sessionService.deleteAll(userId);
    } catch (error) {
      console.log(error);
    }
  }

  private async saveSession(
    sessionId: string,
    refreshToken: string,
    userId: bigint,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    try {
      const data = createSessionSchema.parse({
        id: sessionId,
        refreshToken: hashedRefreshToken,
        userId: userId,
      });
      await this.sessionService.create(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new InternalServerErrorException('Failed to parse session');
      }
      console.log(error);
    }
  }

  private async getTokens(userId: string, sessionId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          sessionId,
          email,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}

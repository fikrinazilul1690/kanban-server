import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto, signUpSchema } from './dto/signup-auth.dto';
import { SignInAuthDto, signInSchema } from './dto/signin-auth.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { refreshTokenSchema } from './dto/refresh-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { Auth } from './entities/auth.entity';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return plainToInstance(Auth, await this.authService.signUp(signUpAuthDto));
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() signInAuthDto: SignInAuthDto) {
    return plainToInstance(Auth, await this.authService.signIn(signInAuthDto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('revoke')
  @UseGuards(RefreshTokenGuard)
  async revoke(@Req() req: Request) {
    const sessionId = req.user!.sessionId!;
    return plainToInstance(Auth, await this.authService.revokeToken(sessionId));
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request) {
    const userId = req.user!.sub;
    const sessionId = req.user!.sessionId!;
    const refreshToken = req.user!.refreshToken!;

    return plainToInstance(
      Auth,
      await this.authService.refreshTokens(
        refreshTokenSchema.parse({
          userId,
          sessionId,
          refreshToken,
        }),
      ),
    );
  }
}

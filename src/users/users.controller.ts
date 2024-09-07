import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('me')
  async me(@Req() req: Request) {
    const id = req.user!.sub;
    const user = await this.userService.findOne({ id });
    if (!user) throw new UnauthorizedException('user not valid');
    return new User(user);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll({});
    return users.map((user) => new User(user));
  }
}

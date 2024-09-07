import { Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export class Auth {
  accessToken: string = '';
  refreshToken: string = '';

  @Type(() => User)
  user?: User;

  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial);
  }
}

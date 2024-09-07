import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSessionDto: CreateSessionDto) {
    return this.prismaService.session.create({ data: createSessionDto });
  }

  findOne(id: string) {
    return this.prismaService.session.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  deleteAll(userId: bigint) {
    return this.prismaService.session.deleteMany({ where: { userId } });
  }

  revoke(id: string) {
    return this.prismaService.session.update({
      where: { id },
      data: { isRevoke: true },
    });
  }
}

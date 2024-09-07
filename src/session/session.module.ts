import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SessionService],
  imports: [PrismaModule],
  exports: [SessionService],
})
export class SessionModule {}

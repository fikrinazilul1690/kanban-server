import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createMemberDto: CreateMemberDto) {
    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: createMemberDto.userId },
        select: {
          name: true,
          email: true,
        },
      });
      return await tx.memberOnProject.create({
        data: {
          ...user,
          ...createMemberDto,
        },
      });
    });
  }

  findAll(filter: Prisma.MemberOnProjectWhereInput) {
    return this.prismaService.memberOnProject.findMany({
      where: filter,
    });
  }

  findOne(id: bigint) {
    return this.prismaService.memberOnProject.findUnique({
      where: { id },
    });
  }

  update(id: bigint, updateMemberDto: UpdateMemberDto) {
    return this.prismaService.memberOnProject.update({
      where: { id },
      data: updateMemberDto,
    });
  }

  remove(userId: bigint, id: bigint) {
    return this.prismaService.$transaction(async (tx) => {
      const member = await tx.memberOnProject.findUniqueOrThrow({
        where: { id },
        include: {
          project: true,
        },
      });
      const role = member.role.toLowerCase();
      if (userId !== member.userId && !(role === 'owner' || role === 'admin')) {
        throw new ForbiddenException(
          "you don't have permission to perform this action.",
        );
      }

      if (member.project.ownerId === userId) {
        throw new ConflictException(
          'project need an owner. Try transfer project owner before this action',
        );
      }

      return await tx.memberOnProject.delete({ where: { id: member.id } });
    });
  }
}

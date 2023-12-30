import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async create(createMembershipDto: CreateMembershipDto) {
    try {
      const membership = await this.prisma.membership.create({
        data: createMembershipDto,
      });
      return {
        message: 'Membership created successfully',
        data: membership,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Membership not created',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll() {
    try {
      const memberships = await this.prisma.membership.findMany();
      return {
        message: 'Memberships retrieved successfully',
        data: memberships,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Memberships not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByTwoId(userId: number, guestId: number) {
    try {
      const membership = await this.prisma.membership.findFirst({
        where: {
          AND: [
            { userId: userId },
            { conversation: { members: { some: { userId: guestId } }, type: "direct" } },
          ],
        },
        include: { conversation: true },
      });
      if (!membership) {
        return {
          message: 'Membership not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Membership retrieved successfully',
        data: membership,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Membership not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByUserIdConversationId(userId: number, conversationId: number) {
    try {
      const membership = await this.prisma.membership.findFirst({
        where: {
          AND: [{ userId: userId }, { conversationId: conversationId }],
        },
      });
      if (!membership) {
        return {
          message: 'Membership not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Membership retrieved successfully',
        data: membership,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Membership not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: number) {
    try {
      const membership = await this.prisma.membership.findUnique({
        where: {
          id: +id,
        },
      });
      if (!membership) {
        return {
          message: 'Membership not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Membership retrieved successfully',
        data: membership,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Membership not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto, time: number) {
    try {
      // add time of minutes to mutedEndTime
      const date = new Date();
      
      const update = await this.prisma.membership.update({
        where: {
          id: id,
        },
        data: {
          ...updateMembershipDto,
          mutedEndTime: new Date(date.setMinutes(date.getMinutes() + time)),
        }
      });
      if (!update) {
        return {
          message: 'Membership not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Membership updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Membership not updated',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number) {
    try {
      const membership = await this.prisma.membership.delete({
        where: {
          id: id,
        },
      });
      if (!membership) {
        return {
          message: 'Membership not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Membership deleted successfully',
        data: membership,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Membership not deleted',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserproviderService {
  constructor(private prisma: PrismaService) {}

  async create(userId, providerId, loginId: string) {
    try {
      const userprovider = await this.prisma.userProvider.create({
        data: {
          userId: userId,
          providerId: providerId,
          loginId: loginId,
        },
      });
      if (userprovider) {
        return {
          message: 'Userprovider created successfully',
          data: userprovider,
          status: HttpStatus.CREATED,
        };
      }
      return {
        message: 'Userprovider not created',
        data: userprovider,
        status: HttpStatus.BAD_REQUEST,
      };
    } catch (error) {
      return {
        message: 'Userprovider not created',
        data: error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findAll() {
    try {
      const findAll = await this.prisma.userProvider.findMany();
      return {
        message: 'Userproviders found successfully',
        data: findAll,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Userproviders not found',
        data: error,
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  async findOne(id: number) {
    try {
      const findOne = await this.prisma.userProvider.findUnique({
        where: {
          id: id,
        },
      });
      return {
        message: 'Userprovider found successfully',
        data: findOne,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Userprovider not found',
        data: error,
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  async findByLoginId(loginId) {
    try {
      const findByLoginId = await this.prisma.userProvider.findFirst({
        where: {
          loginId: loginId,
        },
      });
      if (!findByLoginId)
        return {
          message: 'Userprovider not found',
          data: findByLoginId,
          status: HttpStatus.NOT_FOUND,
        };
      return {
        message: 'Userprovider found successfully',
        data: findByLoginId,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Userprovider not found',
        data: error,
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  // update(id: number, updateUserproviderDto: UpdateUserproviderDto) {
  //   return `This action updates a #${id} userprovider`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userprovider`;
  // }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  async create(createBlockDto: CreateBlockDto, id: number) {
    try {
      const create = await this.prisma.block.create({
        data: {
          blockedId: id,
          blockerId: +createBlockDto.blockerId,
        },
      });
      if (!create) {
        return {
          message: 'Block not created',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Block created successfully',
        data: create,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll() {
    try {
      const blocks = await this.prisma.block.findMany();
      return {
        message: 'Blocks retrieved successfully',
        data: blocks,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findTwoBlocks(id: number, blocked: number) {
    try {
      const blocks = await this.prisma.block.findMany({
        where: {
          OR: [
            {
              blockerId: id,
              blockedId: blocked,
            },
            {
              blockedId: id,
              blockerId: blocked,
            },
          ],
        },
      });
      if (!blocks) {
        return {
          message: 'Block not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Blocks retrieved successfully',
        data: blocks,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: number) {
    try {
      const block = await this.prisma.block.findUnique({
        where: {
          id: id,
        },
      });
      if (!block) {
        return {
          message: 'Block not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Block retrieved successfully',
        data: block,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    try {
      const update = this.prisma.block.update({
        where: {
          id: id,
        },
        data: updateBlockDto,
      });
      if (!update) {
        return {
          message: 'Block not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Block updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number, blocked: number) {
    try {
      const block = await this.prisma.block.findMany({
        where: {
          OR: [
            {
              blockerId: id,
              blockedId: blocked,
            },
            {
              blockedId: id,
              blockerId: blocked,
            },
          ],
        }
      });
      if(!block) {
        return {
          message: 'Block not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      const remove = await this.prisma.block.delete({
        where: {
          id: block[0].id,
        },
      });
      if (!remove) {
        return {
          message: 'Block not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Block deleted successfully',
        data: remove,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

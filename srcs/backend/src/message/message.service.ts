import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const message = await this.prisma.message.create({
        data: createMessageDto,
      });
      return {
        message: 'Message created successfully',
        data: message,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Message not created',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll() {
    try {
      const messages = await this.prisma.message.findMany();
      return {
        message: 'Messages retrieved successfully',
        data: messages,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Messages not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: number) {
    try {
      const message = await this.prisma.message.findUnique({
        where: {
          id: id,
        },
      });
      if (!message) {
        return {
          message: 'Message not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Message retrieved successfully',
        data: message,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Message not retrieved',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const update = await this.prisma.message.update({
        where: {
          id: id,
        },
        data: updateMessageDto,
      });
      if (!update) {
        return {
          message: 'Message not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Message updated successfully',
        data: update,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Message not updated',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number) {
    try {
      const message = await this.prisma.message.delete({
        where: {
          id: id,
        },
      });
      if (!message) {
        return {
          message: 'Message not found',
          data: null,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: 'Message deleted successfully',
        data: message,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Message not deleted',
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

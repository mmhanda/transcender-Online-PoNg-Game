import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createChallengeDto: CreateChallengeDto) {
    try {
      const challenge = await this.prisma.challenge.create({
        data: createChallengeDto,
      });
      return challenge;
    } catch (error) {
    }
  }

  async findAll() {
    try {
      const challenges = await this.prisma.challenge.findMany({
        include: {
          sender: true,
          receiver: true,
        },
      });
      return challenges;
    } catch (error) {
    }
  }

  async findOne(id: number) {
    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: {
          id,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
      return challenge;
    }
    catch (error) {
    }
  }

  async update(id: number, updateChallengeDto: UpdateChallengeDto) {
    try {
      const challenge = await this.prisma.challenge.update({
        where: {
          id,
        },
        data: updateChallengeDto,
      });
      return challenge;
    }
    catch (error) {
    }
  }

  async remove(id: number) {
    try {
      const challenge = await this.prisma.challenge.delete({
        where: {
          id,
        },
      });
      return challenge;
    }
    catch (error) {
    }
  }
}

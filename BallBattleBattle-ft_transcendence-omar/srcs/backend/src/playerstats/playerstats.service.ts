import { Injectable } from '@nestjs/common';
import { CreatePlayerstatDto } from './dto/create-playerstat.dto';
import { UpdatePlayerstatDto } from './dto/update-playerstat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerstatsService {
  constructor(private prisma: PrismaService) {}

  async create(createPlayerstatDto: CreatePlayerstatDto) {
    try {
      const playerstats = await this.prisma.playerStats.create({
        data: {
          ...createPlayerstatDto,
        },
      });
      return playerstats;
    } catch (error) {
      throw error;
    }
  }

  async createPlayerstats(id: number) {
    try {
      const playerstats = await this.prisma.playerStats.create({
        data: {
          userId: id,
        },
      });
      return playerstats;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const playerstats = await this.prisma.playerStats.findMany();
      return playerstats;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const playerstats = await this.prisma.playerStats.findUnique({
        where: {
          id: id,
        },
        include: {
          user: {
            select: {
              fullname: true,
              avatar: true,
              createdAt: true,
              id: true,
            },
          },
          host: true,
          guest: true,
        },
      });
      return playerstats;
    }
    catch (error) {
      throw error;
    }
  }

  async findOneByUserId(userId: number) {
    try {
      const playerstats = await this.prisma.playerStats.findUnique({
        where: {
          userId: userId,
        },
      });
      return playerstats;
    }
    catch (error) {
      throw error;
    }
  }

  async top10() {
    try {
      const playerstats = await this.prisma.playerStats.findMany({
        orderBy: {
          rank: 'desc',
        },
        take: 20, 
        select: {
          rank: true,
          user: {
            select: {
              fullname: true,
              avatar: true,
              createdAt: true,
              id: true,
            },
          },
        },
      });
      return playerstats;
    }
    catch (error) {
      return error;
    }
  }

  async top100() {
    try {
      const playerstats = await this.prisma.playerStats.findMany({
        orderBy: {
          rank: 'desc',
        },
        include: {
          user: {
            select: {
              fullname: true,
              email: true,
              status: true,
              avatar: true,
              createdAt: true,
              id: true,
            }
          },
          host: true,
          guest: true,
          win: true,
        },
        
        take: 100,
      });
      return playerstats;
    }
    catch (error) {
      return error;
    }
  }

    async findLLTiers() {
      const tiers = await this.prisma.tiers.findMany({
        orderBy: {
          id: 'asc',
        },
      });
  
      return tiers
    }

  async update(id: number, updatePlayerstatDto: UpdatePlayerstatDto) {
    try {
      const playerstats = await this.prisma.playerStats.update({
        where: {
          id: id,
        },
        data: {
          ...updatePlayerstatDto,
        },
      });
      return playerstats;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const playerstats = await this.prisma.playerStats.delete({
        where: {
          id: id,
        },
      });
      return playerstats;
    }
    catch (error) {
      throw error;
    }
  }
}

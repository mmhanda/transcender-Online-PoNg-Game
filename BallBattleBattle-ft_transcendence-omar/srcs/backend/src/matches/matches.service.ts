import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) { }

  async createMatches(data: any) {
    try {
      const matches = await this.prisma.match.create({
        data,
      })
      return matches;
    } catch (error) {
      throw error;
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
  async findUserMatches(playerId: number, userId: number) {
    try{
      const userMatches = await this.prisma.match.findMany({
        where: {
          status: 'finished',
          OR: [{ hostId: playerId }, { guestId: playerId }],
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          host: {
            select: {
              rank: true,
              xp: true,
              user: {
                select: {
                  fullname: true,
                  avatar: true,
                  id: true,
                },
              },
            },
          },
          guest: {
            select: {
              rank: true,
              xp: true,
              user: {
                select: {
                  fullname: true,
                  avatar: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return userMatches.map((match) => ({
        id: match.id,
        userId: match.host.user.id === userId ? match.guest.user.id : match.host.user.id,
        user_avatar: match.host.user.id === userId ? match.guest.user.avatar : match.host.user.avatar,
        user_name: match.host.user.id === userId ? match.guest.user.fullname : match.host.user.fullname,
        user_rank: match.host.user.id === userId ? match.guest.rank : match.host.rank,
        user_xp: match.host.user.id === userId ? match.guest.xp : match.host.xp,
        winer_result: match.result.split(':')[0] < match.result.split(':')[1] ? match.result.split(':')[1] : match.result.split(':')[0],
        loser_result: match.result.split(':')[0] > match.result.split(':')[1] ? match.result.split(':')[1] : match.result.split(':')[0],
        match_Winer: match.winnerId,
        rankbefore: match.host.user.id === userId ? match.hostRankBefore : match.guestRankBefore,
        earnpoint: match.host.user.id === userId ? match.rankPointsEarned[0] : match.rankPointsEarned[1],
      }));
    }catch(error){
      throw error;
    }
  }


  async getMatchesById(id: number) {
    try {
      const matches = await this.prisma.match.findUnique({
        where: {
          id,
        },
      });
      return matches;
    } catch (error) {
      throw error;
    }
  }

  async getAllMatches() {
    try {
      const matches = await this.prisma.match.findMany();
      return matches;
    } catch (error) {
      throw error;
    }
  }

  async updateMatches(id: number, data: any) {
    try {
      const matches = await this.prisma.match.update({
        where: {
          id,
        },
        data,
      });
      return matches;
    } catch (error) {
      throw error;
    }
  }

  async deleteMatches(id: number) {
    try {
      const matches = await this.prisma.match.delete({
        where: {
          id,
        },
      });
      return matches;
    } catch (error) {
      throw error;
    }
  }
}

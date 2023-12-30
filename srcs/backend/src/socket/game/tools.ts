import { PrismaService } from 'src/prisma/prisma.service';
export default class Tools {
  constructor(private prisma: PrismaService) { }
  // main function
  async main(data: any) {
    const host = await this.getPlayers(+data.dbAdminId);
    const guest = await this.getPlayers(+data.dbMeetId);
    await this.updateUserStatus(+data.dbAdminId, 'online');
    await this.updateUserStatus(+data.dbMeetId, 'online');
    const newHostRating = await this.calculateElo(
      host.rank,
      guest.rank,
      data.scoreRight > data.scoreLeft ? 1 : 0,
    );
    const newGuestRating = await this.calculateElo(
      guest.rank,
      host.rank,
      data.scoreRight > data.scoreLeft ? 0 : 1,
    );
    // this.updateGame(data, newHostRating, newGuestRating);
    // this.updatePlayerStats(data, newHostRating, newGuestRating);

    this.updateGame(data, Math.round(newHostRating - host.rank)+1, Math.round(newGuestRating - guest.rank)+1);
    this.updatePlayerStats(data, newHostRating+1, newGuestRating+1);
  }

  // get players from table playerstats
  async getPlayers(id: number) {
    try {
      const player = await this.prisma.playerStats.findUnique({
        where: {
          userId: id,
        },
      });
      return player;
    } catch (error) {
    }
  }
  // save the game in table matches
  async saveGame(data: any) {
    try {
      const adminId = +data.dbAdminId;
      const meetId = +data.dbMeetId;
      const host = await this.getPlayers(adminId);
      const guest = await this.getPlayers(meetId);
      const match = await this.prisma.match.create({
        data: {
          hostId: host.id,
          guestId: guest.id,
          watchId: data.RoomID,
          hostRankBefore: host.rank,
          guestRankBefore: guest.rank,
        }
      });
      return match;
    } catch (error) {
      return null;
    }
  }
  async updateGame(data: any, hostelo: number, guestelo: number) {
    try {
      const match = await this.prisma.match.updateMany({
        where: {
          watchId: data.RoomID,
        },
        data: {
          status: "finished",
          result: `${data.scoreLeft}:${data.scoreRight}`,
          rankPointsEarned: [hostelo, guestelo],
          winnerId: data.scoreLeft < data.scoreRight ? data.dbAdminId : data.dbMeetId,
        }
      });
      return match;
    } catch (error) {
      return null;
    }
  }
  async getUsrId(client: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: client,
        },
        include: {
          playerStats: true,
        },
      });
      const tier = await this.prisma.tiers.findFirst({
        where: {
          AND: [
            {
              minRank: {
                lte: user.playerStats.rank,
              },
            },
            {
              maxRank: {
                gte: user.playerStats.rank,
              },
            },
          ],
        },
      });
      delete user.password;
      delete user.twoFactorSecret;
      return { ...user, tier: tier };
    } catch (err) {
    }
  }
  
    async updateUserStatus(id: number, status: string) {
      try {
        const user = await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            status: status,
          },
        });
        return user;
      } catch (error) {
        return null;
      }
    }

    async calculateExpectedScore(rating1: number, rating2: number) {
      //const EA = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
      const EA = Math.round(1 / (1 + Math.pow(10, (rating2 - rating1) / 400)));
      return EA;
    }

  async calculateElo(rating1: number, rating2: number, score: number) {
    const EA = await this.calculateExpectedScore(rating1, rating2);
    const newRating = rating1 + 32 * (score - EA);
    return newRating;
  }
  // calculate the rating of the players and update the table playerstats
  async updatePlayerStats(data: any, newHostRating: number, newGuestRating: number) {
    try {
      const host = await this.getPlayers(+data.dbAdminId);
      const guest = await this.getPlayers(+data.dbMeetId);
      await this.prisma.playerStats.update({
        where: {
          userId: +data.dbAdminId,
        },
        data: {
          rank: +newHostRating,
          wins: data.scoreLeft < data.scoreRight ? host.wins + 1 : host.wins,
          losses:
            data.scoreLeft > data.scoreRight ? host.losses + 1 : host.losses,
          draws:
            data.scoreLeft == data.scoreRight ? host.draws + 1 : host.draws,
          xp: data.scoreLeft < data.scoreRight ? host.xp + 30 : host.xp + 10,
          playeTime: host.playeTime + (data.time_end - data.time_start),
        },
      });
      await this.prisma.playerStats.update({
        where: {
          userId: +data.dbMeetId,
        },
        data: {
          rank: +newGuestRating,
          wins: data.scoreRight < data.scoreLeft ? guest.wins + 1 : guest.wins,
          losses:
            data.scoreRight > data.scoreLeft ? guest.losses + 1 : guest.losses,
          draws:
            data.scoreRight == data.scoreLeft ? guest.draws + 1 : guest.draws,
          xp: data.scoreRight < data.scoreLeft ? guest.xp + 30 : guest.xp + 10,
          playeTime: guest.playeTime + (data.time_end - data.time_start),
        },
      });
    } catch (error) {
    }
  }
}
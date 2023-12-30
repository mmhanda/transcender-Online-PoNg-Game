import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlayerstatsService } from './playerstats.service';
import { CreatePlayerstatDto } from './dto/create-playerstat.dto';
import { UpdatePlayerstatDto } from './dto/update-playerstat.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('playerstats')
@ApiTags('playerstats')
export class PlayerstatsController {
  constructor(private readonly playerstatsService: PlayerstatsService) {}

  @Get('leaderboard/top10')
  findTop10() {
    return this.playerstatsService.top10();
  }

  @Get('leaderboard/top100')
  @UseGuards(AuthGuard)
  async findTop100() {
    const tiers = await this.playerstatsService.findLLTiers();
    const playerstats = this.playerstatsService.top100();
    playerstats.then((playerstats) => {
      playerstats.forEach((playerstat) => {
        tiers.forEach((tier) => {
          if (playerstat.rank >= tier.minRank && playerstat.rank <= tier.maxRank)
            playerstat.tiers = tier;
        });
        playerstat.matchCount = playerstat.host.length + playerstat.guest.length;
        delete playerstat.host
        delete playerstat.guest
        playerstat.wins = playerstat.win.length;
        playerstat.losses = playerstat.matchCount - playerstat.wins;
        playerstat.draws = playerstat.matchCount - playerstat.wins - playerstat.loses;
        delete playerstat.win
      });
    }
    );
    return playerstats;
  }
}

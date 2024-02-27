import { Controller, Get, Req } from '@nestjs/common';
import { MatchesService } from './matches/matches.service';
import { UsersService } from './users/users.service';
import { PlayerstatsService } from './playerstats/playerstats.service';
import { ConversationService } from './conversation/conversation.service';
import { JwtService } from '@nestjs/jwt';

@Controller('global')
export class AppController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly userServices: UsersService,
    private readonly conversationsService: ConversationService,
    private readonly playersStatsService: PlayerstatsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getGlobal(@Req() req) {
    const playersCount = await this.userServices.findAll();
    const matches = await this.matchesService.getAllMatches();
    const conversations = await this.conversationsService.findAll();
    const Top10 = await this.playersStatsService.top10();
    const hotChaneels = await this.conversationsService.findHotConversations();
    if (!req.cookies.token)
      return {
        playersCount: playersCount.data.length,
        matchesCount: matches.length,
        conversations: conversations.data.length,
        topPlayers: Top10,
        hotChaneels: hotChaneels,
        matches: matches,
        isLogged: false,
      };
    const isLogged = await this.jwtService.verifyAsync(req.cookies.token);
    return {
      playersCount: playersCount.data.length,
      matchesCount: matches.length,
      conversations: conversations.data.length,
      topPlayers: Top10,
      hotChaneels: hotChaneels,
      matches: matches,
      isLogged: isLogged.id ? true : false,
    };
  }
}

import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PlayerstatsService } from 'src/playerstats/playerstats.service';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService, private readonly playerStatsServicce: PlayerstatsService) {}

    @Get(':id')
    @UseGuards(AuthGuard)
    async findUserMatches(@Req() req: any, @Param('id') id: string) {
        if (+id == 0)
            id = req.user.id.toString();
        const tiers = await this.matchesService.findLLTiers();
        const player = await this.playerStatsServicce.findOneByUserId(+id);
        const matches = await this.matchesService.findUserMatches(player.id, +id);
        return { tiers, matches };
    }
}

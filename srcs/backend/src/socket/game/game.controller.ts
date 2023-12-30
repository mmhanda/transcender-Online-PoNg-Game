import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { toJSON } from 'flatted';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/games')
  getAllGames(): any {
    return toJSON(this.gameService.getAllGames());
  }
}

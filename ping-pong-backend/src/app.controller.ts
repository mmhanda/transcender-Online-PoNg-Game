import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { toJSON } from 'flatted';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/games')
  getAllGames(): any {
    return toJSON(this.appService.getAllGames());
  }

  @Get()
  getLiveGames(@Param('roomId') roomId) {
    console.error('roomIds');
    // gateway;
    return 'HI';
  }
}

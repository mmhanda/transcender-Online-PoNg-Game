import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { toJSON } from 'flatted';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get('/games')
  getAllGames(): any {
    return toJSON(this.appService.getAllGames());
  }
}

import { Injectable } from '@nestjs/common';
import { Rooms } from './gateway/gateway';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllGames(): any {
    return Rooms;
  }
}

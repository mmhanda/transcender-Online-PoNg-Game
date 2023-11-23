import { Injectable } from '@nestjs/common';
import { Rooms } from './gateway/gateway';

@Injectable()
export class AppService {
  getAllGames(): any {
    return Rooms;
  }
}

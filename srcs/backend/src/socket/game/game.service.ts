import { Injectable } from '@nestjs/common';
import { Rooms } from './gateway';

@Injectable()
export class GameService {
  getAllGames(): any {
    return Rooms;
  }
}

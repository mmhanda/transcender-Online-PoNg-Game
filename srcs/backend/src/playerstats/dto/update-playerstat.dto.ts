import { PartialType } from '@nestjs/swagger';
import { CreatePlayerstatDto } from './create-playerstat.dto';

export class UpdatePlayerstatDto extends PartialType(CreatePlayerstatDto) {}

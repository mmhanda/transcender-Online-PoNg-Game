import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBlockDto {
  @ApiProperty()
  @IsNotEmpty()
  blockerId: number;
}

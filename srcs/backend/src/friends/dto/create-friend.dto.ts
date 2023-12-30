import { ApiProperty } from '@nestjs/swagger';
import { FriendsStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  status: FriendsStatus;
}

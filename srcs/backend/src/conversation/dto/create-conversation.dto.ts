import { ApiProperty } from '@nestjs/swagger';
import { ChannelStatus, ChannelType } from '@prisma/client';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  status: ChannelStatus;

  @ApiProperty()
  @IsNotEmpty()
  type: ChannelType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  guestId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}

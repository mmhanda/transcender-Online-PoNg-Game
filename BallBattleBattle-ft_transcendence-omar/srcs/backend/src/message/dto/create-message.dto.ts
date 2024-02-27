import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: MessageStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  conversationId: number;
}

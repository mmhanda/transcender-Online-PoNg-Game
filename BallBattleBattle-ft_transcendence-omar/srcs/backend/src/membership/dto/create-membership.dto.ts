import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Membershiptype } from '@prisma/client';

export class CreateMembershipDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: Membershiptype;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  conversationId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  unread: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateChallengeDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    senderId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    receiverId: number;
}

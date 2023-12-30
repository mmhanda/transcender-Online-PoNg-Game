import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('block')
@ApiTags('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBlockDto: CreateBlockDto, @Req() req) {
    const id = req.user.id;
    return this.blockService.create(createBlockDto, id);
  }

  @Get()
  findAll() {
    return this.blockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blockService.update(+id, updateBlockDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const blocked = req.user.id;
    return this.blockService.remove(+id, blocked);
  }
}

import { PartialType } from '@nestjs/swagger';
import { CreateUserproviderDto } from './create-userprovider.dto';

export class UpdateUserproviderDto extends PartialType(CreateUserproviderDto) {}

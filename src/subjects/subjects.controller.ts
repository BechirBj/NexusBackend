import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private service: SubjectsService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.service.list(user.sub);
  }

  @Get('ByWorkspace/:id')
  listByWorkspace(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.listByWorkspace(id, user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateSubjectDto) {
    console.log(user);
    console.log('Creating subject with data:', dto);
    return this.service.create(user.sub, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.get(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.service.update(id, user.sub, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.delete(id, user.sub);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateReportDto) {
    return this.service.create(user.sub, dto);
  }

  @Get('subject/:subjectId')
  list(@CurrentUser() user: { sub: string }, @Param('subjectId') subjectId: string) {
    return this.service.listBySubject(subjectId, user.sub);
  }

  @Get(':id')
  get(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.get(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
  ) {
    return this.service.update(id, user.sub, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.delete(id, user.sub);
  }
}

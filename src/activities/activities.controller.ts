import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class ActivitiesController {
  constructor(private service: ActivitiesService) {}

  @Get('subjects/:id/activity')
  list(@Param('id') subjectId: string) {
    return this.service.listBySubject(subjectId);
  }
}

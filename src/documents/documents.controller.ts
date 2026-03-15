import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UploadDocumentDto } from './dto/upload-document.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  upload(
    @CurrentUser() user: { sub: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.service.upload(user.sub, dto.subjectId, dto.title, file);
  }

  @Get('subject/:subjectId')
  list(@CurrentUser() user: { sub: string }, @Param('subjectId') subjectId: string) {
    return this.service.listBySubject(subjectId, user.sub);
  }


  // @Get('GetBySubject/:subjectId')
  // getBySubject(@CurrentUser() user: { sub: string }, @Param('subjectId') subjectId: string) {
  //   return this.service.listBySubject(subjectId, user.sub);
  // }

  @Delete(':id')
  delete(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.delete(id, user.sub);
  }
}

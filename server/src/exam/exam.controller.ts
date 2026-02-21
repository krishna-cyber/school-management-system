import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { MarksService } from './marks.service';
import { CreateMarkSheetDto } from './dto/create-marksheet.dto';
import express from 'express';
import { GenerateMarksheetDto } from './dto/generate-marksheet.dto';

@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly marksService: MarksService,
  ) {}

  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }

  @Post('/marks/:id')
  createMarksheet(
    @Param('id') id: string,
    @Body() createMarkSheetDto: CreateMarkSheetDto,
  ) {
    return this.marksService.saveMarksheet(id, createMarkSheetDto);
  }

  @Get('/marks/:studentId')
  getMarksheet(@Param('studentId') studentId: string) {
    return this.marksService.getMarksheet(studentId);
  }

  @Get('/generate/marksheet')
  generateMarksheet(
    @Query(new ValidationPipe({ transform: true }))
    query: GenerateMarksheetDto,
  ) {
    return this.marksService.generateMarksheet(query.studentId, query.examId);
  }

  @Get('/preview/:jobId')
  async previewMarksheet(
    @Param('jobId') id: string,
    @Res() res: express.Response,
  ) {
    const marksheet = await this.marksService.previewMarksheet(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="marksheet-${id}.pdf"`,
      'Content-Length': marksheet.length,
    });

    res.end(marksheet);
  }

  @Get('/ledger/:id')
  getExamLedger(@Param('id') id: string) {
    return this.examService.getExamLedger(+id);
  }
}

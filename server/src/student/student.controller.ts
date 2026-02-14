import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentDataTransferService } from './student-data-transfer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly studentImportService: StudentDataTransferService,
  ) {}

  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: CreateStudentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
    },
  })
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  importStudents(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file);
    return this.studentImportService.import();
  }

  @Get('/export')
  exportStudents() {
    return this.studentImportService.export();
  }
}

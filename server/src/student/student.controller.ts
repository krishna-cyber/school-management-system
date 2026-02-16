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
  BadRequestException,
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

  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully retrieved.',
    type: CreateStudentDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid student ID format.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid student ID format',
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a student by ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully deleted.',
    example: {
      success: true,
      message: 'Student deleted successfully',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Post('/import')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter(req, file, callback) {
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only Excel files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  importStudents(@UploadedFile() file: Express.Multer.File) {
    return this.studentImportService.import(file);
  }

  @Get('/export')
  exportStudents() {
    return this.studentImportService.export();
  }
}

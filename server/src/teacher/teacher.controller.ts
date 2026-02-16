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
import { TeacherService } from './teacher.service';
import {
  CreateTeacherDto,
  CreateTeacherResponseDto,
} from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherDataTransferService } from './teacher-data-transfer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly teacherImportService: TeacherDataTransferService,
  ) {}

  @ApiOperation({ summary: 'Register a new teacher' })
  @ApiResponse({
    status: 201,
    description: 'The teacher has been successfully created.',
    type: CreateTeacherResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
    },
  })
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully retrieved.',
    type: CreateTeacherDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid teacher ID.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid teacher ID',
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully updated.',
    type: CreateTeacherDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid teacher ID or input data.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid teacher ID or input data',
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully deleted.',
    example: {
      success: true,
      message: 'Teacher deleted successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid teacher ID.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid teacher ID',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  importTeachers(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file);
    return this.teacherImportService.import();
  }

  @Get('/export')
  exportTeachers() {
    return this.teacherImportService.export();
  }
}

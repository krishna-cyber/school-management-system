import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({
    status: 201,
    description: 'The class has been successfully created.',
    example: {
      success: true,
      message: 'Class created successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      error: 'Bad Request',
    },
  })
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @ApiOperation({ summary: 'Get a class by ID' })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully retrieved.',
    type: CreateClassDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid class ID',
    example: {
      statusCode: 400,
      message: 'Invalid class ID',
      error: 'Bad Request',
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a class by ID' })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully updated.',
    type: CreateClassDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid class ID',
    example: {
      statusCode: 400,
      message: 'Invalid class ID',
      error: 'Bad Request',
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @ApiOperation({ summary: 'Delete a class by ID' })
  @ApiResponse({
    status: 200,
    description: 'The class has been successfully deleted.',
    example: {
      success: true,
      message: 'Class deleted successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid class ID',
    example: {
      statusCode: 400,
      message: 'Invalid class ID',
      error: 'Bad Request',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}

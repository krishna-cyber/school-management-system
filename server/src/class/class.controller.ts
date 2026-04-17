import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor'
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { ClassService } from './class.service'
import { CreateClassDto } from './dto/create-class.dto'
import { UpdateClassDto } from './dto/update-class.dto'

export interface TenantRequest extends Request {
  tenantId: string
}

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
    return this.classService.create(createClassDto)
  }

  @Get()
  findAll(@Query('count_student') countStudent: boolean) {
    return this.classService.findAll(countStudent)
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
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id)
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
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto)
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
    return this.classService.remove(id)
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importFromExcel(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: TenantRequest,
  ) {
    return this.classService.importFromExcel(file, req?.tenantId)
  }
}

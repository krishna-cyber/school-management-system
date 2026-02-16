import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @ApiOperation({ summary: 'Create a new fee' })
  @ApiResponse({
    status: 201,
    example: {
      success: true,
      message: 'Fee created successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Failed to create fee.',
    example: {
      statusCode: 400,
      error: 'Bad Request',
    },
  })
  @Post()
  create(@Body() createFeeDto: CreateFeeDto) {
    return this.feeService.create(createFeeDto);
  }

  @Get()
  findAll() {
    return this.feeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    return this.feeService.update(+id, updateFeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feeService.remove(+id);
  }
}

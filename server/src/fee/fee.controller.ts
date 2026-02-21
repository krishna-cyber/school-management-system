import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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

  @ApiOperation({ summary: 'Get a Fee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The fee has been successfully retrieved.',
    type: CreateFeeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid fee ID',
    example: {
      statusCode: 400,
      message: 'Invalid fee ID',
      error: 'Bad Request',
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a fee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The fee has been successfully updated.',
    type: CreateFeeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid fee ID or input data.',
    example: {
      statusCode: 400,
      message: 'Invalid fee ID or input data',
      error: 'Bad Request',
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    return this.feeService.update(id, updateFeeDto);
  }

  @ApiOperation({ summary: 'Delete a fee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The fee has been successfully deleted.',
    example: {
      success: true,
      message: 'Fee deleted successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid fee ID',
    example: {
      statusCode: 400,
      message: 'Invalid fee ID',
      error: 'Bad Request',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feeService.remove(id);
  }

  @Get('generate-invoice/:studentId')
  async generateInvoice(
    @Param('studentId') studentId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.feeService.generateInvoice(studentId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${studentId}.pdf"`,
      'Content-Length': invoice.length,
    });
    res.end(invoice);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Fee } from './schemas/fee.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class FeeService {
  constructor(@InjectModel(Fee.name) private readonly feeModel: Model<Fee>) {}
  async create(createFeeDto: CreateFeeDto) {
    const createdFee = new this.feeModel(createFeeDto);
    await createdFee.save();
    return {
      success: true,
      message: 'Fee created successfully',
    };
  }

  findAll() {
    return `This action returns all fee`;
  }

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid fee ID');
    }

    return this.feeModel.findById(id);
  }

  update(id: number, updateFeeDto: UpdateFeeDto) {
    return `This action updates a #${id} fee`;
  }

  remove(id: number) {
    return `This action removes a #${id} fee`;
  }
}

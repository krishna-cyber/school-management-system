import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class } from './schemas/class.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
  ) {}
  async create(createClassDto: CreateClassDto) {
    try {
      const createdClass = new this.classModel(createClassDto);
      await createdClass.save();

      return {
        success: true,
        message: 'Class created successfully',
      };
    } catch (error) {
      if (
        error instanceof mongoose.Error.ValidationError ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.code === 11000
      ) {
        throw new BadRequestException(
          'Validation error or class already exist',
          {
            cause: error,
          },
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.classModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}

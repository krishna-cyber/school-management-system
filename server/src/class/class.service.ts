import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class } from './schemas/class.schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
    @InjectQueue('classImportQueue') private readonly importQueue: Queue,
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

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid class ID');
    }
    return this.classModel.findById(id);
  }

  update(id: string, updateClassDto: UpdateClassDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid class ID');
    }
    return this.classModel.findByIdAndUpdate(id, updateClassDto, { new: true });
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid class ID');
    }
    await this.classModel.findByIdAndDelete(id);

    return { success: true, message: 'Class deleted successfully' };
  }

  async importFromExcel(file: Express.Multer.File) {
    await this.importQueue.add('classImportQueue', { filePath: file.path });
    // This method will be implemented in the future to handle the import of class data from an Excel file.
    return {
      success: true,
      message: 'Class import from Excel initiated successfully',
    };
  }
}

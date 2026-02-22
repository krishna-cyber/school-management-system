import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const createStudent = new this.studentModel(createStudentDto);
    await createStudent.save();
    return { success: true, message: 'Student created successfully' };
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid student ID format');
    }
    return this.studentModel.findById(id).populate('class');
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid student ID format');
    }
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    return this.studentModel.findByIdAndUpdate(id, updateStudentDto, {
      returnDocument: 'after',
    });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid student ID format');
    }
    await this.studentModel.findByIdAndDelete(id);
    return { success: true, message: 'Student deleted successfully' };
  }
}

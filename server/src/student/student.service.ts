import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import mongoose, { Model } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';

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
    return this.studentModel.findById(id);
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}

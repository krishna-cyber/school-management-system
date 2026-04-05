import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';
import mongoose, { Model } from 'mongoose';
import { ListAllEntities } from './dto/query-param.dto';

@Injectable()
export class StudentService {
  constructor(
    @Inject('STUDENT_MODEL') private readonly studentModel: Model<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const createStudent = new this.studentModel(createStudentDto);
    await createStudent.save();
    return { success: true, message: 'Student created successfully' };
  }

  findAll(query: ListAllEntities) {
    console.log('Query parameters:', query);
    let queryConditions = {};

    if (query.class) {
      queryConditions = { ...queryConditions, class: query.class };
    }

    if (query.section) {
      queryConditions = { ...queryConditions, section: query.section };
    }
    console.log('Query conditions:', queryConditions);

    return this.studentModel.find(queryConditions).populate('class');
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

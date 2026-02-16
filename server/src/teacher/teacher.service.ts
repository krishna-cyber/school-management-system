import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from './schemas/teacher.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
    const createTeacher = new this.teacherModel(createTeacherDto);
    await createTeacher.save();
    return { success: true, message: 'Teacher registered successfully' };
  }

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid teacher ID');
    }
    return this.teacherModel.findById(id);
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}

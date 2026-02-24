import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './schemas/teacher.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TeacherService {
  constructor(
    @Inject('TEACHER_MODEL') private readonly teacherModel: Model<Teacher>,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
    const createTeacher = new this.teacherModel(createTeacherDto);
    await createTeacher.save();
    return { success: true, message: 'Teacher registered successfully' };
  }

  findAll() {
    return this.teacherModel.find();
  }

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid teacher ID');
    }
    return this.teacherModel.findById(id);
  }

  update(id: string, updateTeacherDto: UpdateTeacherDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid teacher ID');
    }
    return this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, {
      new: true,
    });
  }

  remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid teacher ID');
    }
    return this.teacherModel.findByIdAndDelete(id);
  }
}

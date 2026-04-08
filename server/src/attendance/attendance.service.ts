import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Model, MongooseError, Types } from 'mongoose';
import { Attendance } from './schema/attendance.schema';
import { Class } from 'src/class/schemas/class.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject('ATTENDANCE_MODEL')
    private readonly attendanceModel: Model<Attendance>,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto) {
    try {
      const newAttendance = new this.attendanceModel({
        ...createAttendanceDto,
        class: new Types.ObjectId(createAttendanceDto.class),
      });
      return await newAttendance.save();
    } catch (error: any) {
      //handle already attendance exist for the class and date
      if (error.code === 11000) {
        throw new ConflictException(
          'Attendance for this class on the given date already exists.',
        );
      }

      // Invalid ObjectId format
      if (
        error instanceof Types.ObjectId.prototype.constructor ||
        error.name === 'BSONError' ||
        error.name === 'CastError'
      ) {
        throw new BadRequestException('Invalid class ID format.');
      }

      throw new InternalServerErrorException(
        'Failed to create attendance record.',
      );
    }
  }

  async findAll() {
    return await this.attendanceModel
      .find()
      .populate('class', 'level section _id');
  }

  async findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}

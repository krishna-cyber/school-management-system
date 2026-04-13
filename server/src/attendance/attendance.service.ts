import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { type Model, Types } from 'mongoose'
import type { CreateAttendanceDto } from './dto/create-attendance.dto'
import type { UpdateAttendanceDto } from './dto/update-attendance.dto'
import type { Attendance } from './schema/attendance.schema'

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
      })
      return await newAttendance.save()
    } catch (error: any) {
      //handle already attendance exist for the class and date
      if (error.code === 11000) {
        throw new ConflictException(
          'Attendance for this class on the given date already exists.',
        )
      }

      // Invalid ObjectId format
      if (
        error instanceof Types.ObjectId.prototype.constructor ||
        error.name === 'BSONError' ||
        error.name === 'CastError'
      ) {
        throw new BadRequestException('Invalid class ID format.')
      }

      throw new InternalServerErrorException(
        'Failed to create attendance record.',
      )
    }
  }

  async findAll() {
    return await this.attendanceModel
      .find()
      .populate('class', 'level section _id')
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid attendance ID format.')
    }
    return await this.attendanceModel
      .findById(id)
      .populate('class', 'level section _id')
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid attendance ID format.')
    }
    return await this.attendanceModel.findByIdAndUpdate(
      id,
      updateAttendanceDto,
      {
        returnDocument: 'after',
      },
    )
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid attendance ID format.')
    }
    return await this.attendanceModel.findByIdAndDelete(id)
  }
}

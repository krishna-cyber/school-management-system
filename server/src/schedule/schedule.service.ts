import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { UpdateScheduleDto } from './dto/update-schedule.dto'
import { Schedule } from './schemas/schedule.schema'

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('SCHEDULE_MODEL') private scheduleModel: Model<Schedule>,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      console.log('Creating schedule with data:', createScheduleDto)
      const createSchedule = new this.scheduleModel(createScheduleDto)
      return await createSchedule.save()
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return `This action returns all schedule`
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`
  }
}

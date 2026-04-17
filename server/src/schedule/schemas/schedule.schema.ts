import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Class } from 'src/class/schemas/class.schema'
import { Teacher } from 'src/teacher/schemas/teacher.schema'

@Schema({ _id: false, timestamps: false })
export class Period {
  @Prop({ required: true, type: String })
  startTime: string

  @Prop({ required: true, type: String })
  endTime: string

  @Prop({ required: true, type: String })
  subject: string

  @Prop({ required: true, type: Types.ObjectId, ref: Teacher.name })
  teacher: string
}

export type PeriodDocument = {
  startTime: string
  endTime: string
  subject: string
  teacher: string
}
export const PeriodSchema = SchemaFactory.createForClass(Period)

// Schedule Schema for a class
export type ScheduleDocument = HydratedDocument<Schedule, PeriodDocument>
@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    required: true,
    type: String,
    enum: ['regular', 'coaching', 'exam'],
    default: 'regular',
  })
  title: string

  @Prop({ type: Types.ObjectId, ref: Class.name, required: true })
  classId: string

  @Prop({
    type: [String],
    required: true,
    default: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    enum: [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ],
  })
  day: string[]

  @Prop({
    type: [PeriodSchema],
    required: true,
  })
  periods: Period[]
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule)

ScheduleSchema.index({ classId: 1, day: 1 }, { unique: true })

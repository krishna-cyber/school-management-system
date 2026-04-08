import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Student } from 'src/student/schemas/student.schema';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({
  _id: false,
  timestamps: false,
})
export class StudentAttendance {
  @Prop({
    type: Types.ObjectId,
    ref: Student.name,
    required: true,
  })
  studentId: string;
  @Prop({
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true,
    default: 'absent',
  })
  status: string;
  @Prop({ type: String, default: null })
  remarks?: string;
}

@Schema({
  timestamps: true,
})
export class Attendance {
  @Prop({
    type: Types.ObjectId,
    ref: Class.name,
    required: true,
  })
  class: string;

  @Prop({ type: [StudentAttendance], default: [], required: true })
  attendance: StudentAttendance[];

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalStudent: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  presentStudent: number;
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  absentStudent: number;
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  leaveStudent: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.index({ class: 1, date: 1 }, { unique: true });

AttendanceSchema.pre<AttendanceDocument>('save', function () {
  const attendance = this.attendance;
  this.totalStudent = attendance.length;
  this.presentStudent = attendance.filter((a) => a.status === 'present').length;
  this.absentStudent = attendance.filter((a) => a.status === 'absent').length;
  this.leaveStudent = attendance.filter((a) => a.status === 'leave').length;
});

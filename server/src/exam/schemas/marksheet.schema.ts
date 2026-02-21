import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Student } from 'src/student/schemas/student.schema';
import { Exam } from './exam.schema';
import { Class } from 'src/class/schemas/class.schema';

export type MarksheetDocument = HydratedDocument<Marksheet>;

@Schema({ _id: false })
export class SubjectMark {
  @Prop({ type: String, required: true })
  subject_name: string;
  @Prop({ type: Number, required: true })
  full_marks: number;
  @Prop({ type: Number, required: true })
  pass_marks: number;
  @Prop({ type: Number, required: true })
  obtained_marks: number;
  @Prop({ type: Boolean, required: true, default: false })
  is_optional: boolean;
  @Prop({ type: Boolean, required: true, default: true })
  is_pass?: boolean;
}

//using snapshot method to store the marksheet data
@Schema({ timestamps: true })
export class Marksheet {
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  student: string;

  @Prop({ type: Types.ObjectId, ref: Exam.name, required: true })
  exam: string;

  @Prop({ type: Types.ObjectId, ref: Class.name, required: true })
  class: string;

  @Prop({ type: [SubjectMark], required: true })
  subjects: SubjectMark[];

  @Prop({ type: Number })
  obtained_marks?: number;

  @Prop({ type: Number })
  percentage?: number;

  @Prop({ type: Boolean })
  is_pass?: boolean;

  @Prop({ type: String })
  remarks?: string;
}

export const MarksheetSchema = SchemaFactory.createForClass(Marksheet);

//prevents a student from having multiple marksheets for the same exam, as a student can only take an exam once.
MarksheetSchema.index({ student: 1, exam: 1 }, { unique: true });

MarksheetSchema.pre('save', function () {
  this.subjects.forEach((subject) => {
    if (subject.obtained_marks > subject.pass_marks) {
      subject.is_pass = true;
    } else {
      subject.is_pass = false;
    }
  });

  this.obtained_marks = this.subjects.reduce((acc, subject) => {
    return acc + subject.obtained_marks;
  }, 0);

  const total_marks = this.subjects.reduce((acc, subject) => {
    return acc + subject.full_marks;
  }, 0);

  const percentage = (this.obtained_marks / total_marks) * 100;

  this.percentage = percentage;

  this.is_pass = this.subjects.every((subject) => subject.is_pass);

  this.remarks = this.is_pass
    ? 'Congratulations! keep up the good work.'
    : 'Better luck next time. Improvement is possible.';
});

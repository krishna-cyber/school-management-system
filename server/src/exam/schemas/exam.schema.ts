import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ type: String, required: true, maxLength: 100, trim: true })
  title: string;

  @Prop({ type: Date, required: true, default: Date.now })
  year: Date;

  @Prop({ type: Date, required: true })
  starts_at: Date;

  @Prop({ type: Date, required: true })
  ends_at: Date;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: [Types.ObjectId], ref: Class.name, required: true })
  class: string[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

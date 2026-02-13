import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({
  _id: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Subject {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  publication: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Subject, SubjectSchema } from './subject.schema';

export type ClassDocumentOverride = {
  subject: Subject;
};

export type ClassDocument = HydratedDocument<Class, ClassDocumentOverride>;

@Schema({
  timestamps: true,
})
export class Class {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [SubjectSchema], required: true, unique: true })
  compulsory_subjects: Subject[];

  @Prop({ type: [SubjectSchema], default: [], unique: true })
  optional_subjects: Subject[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);

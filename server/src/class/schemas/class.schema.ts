import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Subject, SubjectSchema } from './subject.schema';
import { Fee } from 'src/fee/schemas/fee.schema';

export type ClassDocumentOverride = {
  subject: Subject;
};

export type ClassDocument = HydratedDocument<Class, ClassDocumentOverride>;

@Schema({
  timestamps: true,
})
export class Class {
  @Prop({
    required: true,
    enum: [
      'Nursery',
      'L.K.G',
      'U.K.G',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ],
  })
  level: string;

  @Prop({ type: String, default: 'A' })
  section: string;

  @Prop({ type: [SubjectSchema], required: true })
  compulsory_subjects: Subject[];

  @Prop({ type: [SubjectSchema], default: [], unique: true })
  optional_subjects: Subject[];

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: Fee.name,
    default: [],
  })
  fees_associated: string[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.index({ level: 1, section: 1 }, { unique: true });

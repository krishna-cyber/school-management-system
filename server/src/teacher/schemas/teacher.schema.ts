import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Contact, ContactSchema } from 'src/student/schemas/contact.schema';

export type TeacherDocumentOverride = {
  contact: Contact;
};

export type TeacherDocument = HydratedDocument<
  Teacher,
  TeacherDocumentOverride
>;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  full_name: string;

  @Prop({ type: ContactSchema })
  contact: Contact;

  @Prop({ type: String, enum: ['male', 'female', 'other'], required: true })
  gender: string;

  @Prop({ type: Number, required: true })
  salary: number;

  @Prop({ type: String, required: true })
  photo: string;

  @Prop({ type: String, required: true })
  qualification: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

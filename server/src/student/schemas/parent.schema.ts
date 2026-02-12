import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Contact, ContactSchema } from './contact.schema';

export type ParentDocument = HydratedDocument<Parent>;

@Schema({
  timestamps: true,
})
export class Parent {
  @Prop({ required: true })
  full_name: string;

  @Prop({ type: String })
  photo: string;

  @Prop({
    type: String,
    required: true,
    enum: {
      values: [
        'Teacher',
        'Engineer',
        'Doctor',
        'Business',
        'Agriculture',
        'Other',
      ],
      message:
        'Occupation must be one of: Teacher, Engineer, Doctor, Business, Agriculture, Other',
    },
  })
  occupation: string;

  @Prop({
    type: String,
    enum: {
      values: [
        'slc',
        'intermediate',
        'bachelor',
        'master',
        'phd',
        'illeterate',
        'other',
      ],
    },
  })
  qualification: string;

  @Prop({ type: ContactSchema })
  contact: Contact;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({
  _id: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Contact {
  @Prop({
    type: [String],
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
    validate: {
      validator: function (value: string[]) {
        return value.length > 0;
      },
      message: 'At least one phone number is required',
    },
  })
  phone_number: string[];

  @Prop({
    type: [String],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address',
    ],
    validate: {
      validator: function (value: string[]) {
        return value.length > 0;
      },
      message: 'At least one email address is required',
    },
  })
  email: string[];
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

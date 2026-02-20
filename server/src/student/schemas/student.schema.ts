import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Parent, ParentSchema } from './parent.schema';
import { Class } from 'src/class/schemas/class.schema';
import { Fee } from 'src/fee/schemas/fee.schema';

export type StudentDocumentOverride = {
  parent: Types.Subdocument<Types.ObjectId> & Parent;
  class: Types.Subdocument<Types.ObjectId> & Class;
};
export type StudentDocument = HydratedDocument<
  Student,
  StudentDocumentOverride
>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Student {
  @Prop({ required: true })
  full_name: string;

  @Prop({
    required: true,
    type: Date,
    validate: {
      validator: function (value: Date) {
        const today = new Date();
        return value < today;
      },
      message: 'Date of birth must be in the past',
    },
  })
  date_of_birth: Date;

  @Prop({ type: String, default: null })
  photo: string | null;

  @Prop({ type: String, required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Class.name,
  })
  class: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: ParentSchema, required: true })
  parent: Parent;

  @Prop({ type: [Types.ObjectId], ref: Fee.name })
  extra_fees?: string[];

  @Virtual({
    get: function (this: Student) {
      const today = new Date();
      const birthDate = new Date(this.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      // Adjust age if the birthday hasn't occurred this year yet
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    },
  })
  age?: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.index(
  { class: 1, full_name: 1, date_of_birth: 1 },
  { unique: true },
);

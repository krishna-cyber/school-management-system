import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

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

  @Prop({ type: String })
  photo: string;

  @Prop({ required: true, type: String })
  address: string;

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
  age: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

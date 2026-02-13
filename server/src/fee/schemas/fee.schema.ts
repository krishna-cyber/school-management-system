import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeeDocument = HydratedDocument<Fee>;

@Schema({
  timestamps: true,
})
export class Fee {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
    enum: ['tuition', 'transportation', 'hostel', 'miscellaneous'],
    default: 'tuition',
  })
  type: string;

  @Prop({
    required: true,
    type: Number,
  })
  amount: number;

  @Prop({
    default: 0,
    type: Number,
  })
  discount: number;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  valid_from: Date;

  @Prop({
    type: Date,
  })
  valid_to: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  is_active: boolean;

  @Prop({
    required: true,
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'one-time'],
    default: 'monthly',
  })
  repetation: string;
}

export const FeeSchema = SchemaFactory.createForClass(Fee);

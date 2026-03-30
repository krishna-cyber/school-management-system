import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  timestamps: true,
})
export class Account {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  accountId: string;

  @Prop({
    required: true,
    type: String,
  })
  providedBy: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  logo: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: Boolean,
    default: false,
    required: true,
  })
  emailVerified: boolean;

  @Prop({
    type: String,
    required: true,
  })
  tenantId: string;

  @Prop({
    type: [String],
    required: true,
  })
  contact: string[];

  @Prop({
    type: String,
    required: true,
  })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

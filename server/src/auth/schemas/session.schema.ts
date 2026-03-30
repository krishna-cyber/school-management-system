import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  timestamps: true,
})
export class Session {
  @Prop({
    required: true,
    type: Date,
  })
  expiresAt: Date;

  @Prop({
    required: true,
    type: String,
  })
  token: string;
  @Prop({
    required: true,
    type: String,
  })
  ipAddress: string;
  @Prop({
    required: true,
    type: String,
  })
  userAgent: string;
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

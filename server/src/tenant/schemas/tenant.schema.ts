import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Tenant>;

@Schema({
  timestamps: true,
})
export class Tenant {
  @Prop({ required: true, unique: true })
  _id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  logo: string;
  @Prop({ required: true })
  contact_email: string;
  @Prop({ required: true })
  contact_phone: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

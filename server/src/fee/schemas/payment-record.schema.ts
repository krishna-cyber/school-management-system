import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PaymentDocument = HydratedDocument<Payment>

@Schema({
  timestamps: true,
})
export class Payment {
  @Prop({ required: true, type: String })
  studentId: string
  @Prop({ required: true, type: [String] })
  fee: string[]
  total_amount: number
  paid_amount: number
  due_amount: number
  particulars: string[]
  payment_method: string
  status: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)

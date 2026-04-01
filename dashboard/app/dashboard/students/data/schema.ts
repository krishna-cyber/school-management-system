import { z } from "zod"

const contactSchema = z.object({
  phone_number: z.array(z.string()),
  email: z.array(z.email()),
})

const parentSchema = z.object({
  full_name: z.string(),
  photo: z.url(),
  occupation: z.string(),
  qualification: z.string(),
  contact: contactSchema,
})

export const studentSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  date_of_birth: z.coerce.date(),
  photo: z.url(),
  gender: z.enum(["male", "female", "other"]),
  class: z.string(), // ObjectId ref → string
  address: z.string(),
  parent: parentSchema,
  extra_fees: z.array(z.unknown()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Student = z.infer<typeof studentSchema>
export type Parent = z.infer<typeof parentSchema>

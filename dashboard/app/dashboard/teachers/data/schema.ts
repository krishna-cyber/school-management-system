import { z } from "zod"

const contactSchema = z.object({
  phone_number: z.array(z.string()),
  email: z.array(z.email()),
})

export const teacherSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  date_of_birth: z.coerce.date(),
  photo: z.url(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string(),
  contact: contactSchema,
  salary: z.number(),
  date_of_joining: z.coerce.date(),
  qualifications: z.array(z.string()),
  experience_years: z.number().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Teacher = z.infer<typeof teacherSchema>

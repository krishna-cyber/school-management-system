import z from "zod"

export const attendanceSchema = z.object({
  roll_number: z.string(),
  full_name: z.string(),
  attendance_status: z.enum(["present", "absent", "leave"]).default("present"),
})

export type Attendance = z.infer<typeof attendanceSchema>

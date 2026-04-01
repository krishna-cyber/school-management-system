import { Mars, Venus, Users } from "lucide-react"
// import { type UserStatus } from "./schema"

// export const callTypes = new Map<UserStatus, string>([
//   ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
//   ["inactive", "bg-neutral-300/40 border-neutral-300"],
//   ["invited", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
//   [
//     "suspended",
//     "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
//   ],
// ])

export const gender = [
  {
    label: "Male",
    value: "male",
    icon: Mars,
  },
  {
    label: "Female",
    value: "female",
    icon: Venus,
  },
  {
    label: "Other",
    value: "other",
    icon: Users,
  },
] as const

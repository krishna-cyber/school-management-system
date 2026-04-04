"use client"

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { ArrowUpDown } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ColumnDef } from "@tanstack/react-table"
import { Attendance } from "./data/schema"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "roll_number",
    header: "Roll Number",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "attendance_status",
    header: "Attendance Status",
    cell: ({ row }) => (
      <RadioGroup
        defaultValue={row.original.attendance_status}
        className="flex max-w-sm"
      >
        <FieldLabel htmlFor="present">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Present</FieldTitle>
            </FieldContent>
            <RadioGroupItem value="present" id="present" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="absent">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Absent</FieldTitle>
            </FieldContent>
            <RadioGroupItem value="absent" id="absent" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="leave">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Leave</FieldTitle>
            </FieldContent>
            <RadioGroupItem value="leave" id="leave" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    ),
  },
]

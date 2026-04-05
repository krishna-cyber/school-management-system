"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { Controller, useForm } from "react-hook-form"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { z } from "zod/v3"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@/components/ui/field"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
const classes = [
  {
    label: "Class 1",
    value: "class1",
    sections: [
      { label: "Section 1A", value: "section1A" },
      { label: "Section 1B", value: "section1B" },
      { label: "Section 1C", value: "section1C" },
    ],
  },
  {
    label: "Class 2",
    value: "class2",
    sections: [
      { label: "Section 2A", value: "section2A" },
      { label: "Section 2B", value: "section2B" },
      { label: "Section 2C", value: "section2C" },
    ],
  },
  {
    label: "Class 3",
    value: "class3",
    sections: [
      { label: "Section 3A", value: "section3A" },
      { label: "Section 3B", value: "section3B" },
      { label: "Section 3C", value: "section3C" },
    ],
  },
  {
    label: "Class 4",
    value: "class4",
    sections: [
      { label: "Section 4A", value: "section4A" },
      { label: "Section 4B", value: "section4B" },
      { label: "Section 4C", value: "section4C" },
    ],
  },
]

const formSchema = z.object({
  class: z.string(),
  section: z.string(),
})

export function DataFilter({
  handleSubmit: handleSubmitProp,
}: {
  handleSubmit: (data: z.infer<typeof formSchema>) => void
}) {
  const { register, control, handleSubmit, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      section: "",
    },
    mode: "onChange",
  })
  const selectedClass = watch("class")
  const selectedSection = watch("section")
  return (
    <form id="filter-form" onSubmit={handleSubmit(handleSubmitProp)}>
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          <FieldGroup className="flex flex-row gap-x-2">
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue=""
                  onValueChange={(value) => {
                    field.onChange(value)
                    reset({ class: value, section: "" })
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {selectedClass && (
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue=""
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .find((cls) => cls.value === selectedClass)
                        ?.sections.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FieldGroup>

          {selectedClass && selectedSection && (
            <Button
              variant="ghost"
              onClick={() => {
                reset({ class: "", section: "" })
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ms-2 h-4 w-4" />
            </Button>
          )}

          <Button
            type="submit"
            form="filter-form"
            disabled={!selectedClass || !selectedSection}
          >
            Submit
          </Button>
        </div>
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </form>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  //TODO:usequery and fetch based on data changes on filter section

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <DataFilter handleSubmit={handleSubmit} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

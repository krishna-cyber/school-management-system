"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { Controller, useForm } from "react-hook-form"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, LoaderCircle, X } from "lucide-react"
import { z } from "zod/v3"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Class } from "../classes/page"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const formSchema = z.object({
  class: z.string(),
  date: z.date(),
})

export function DataFilter({
  handleSubmit: handleSubmitProp,
  isfetching,
}: {
  handleSubmit: (data: z.infer<typeof formSchema>) => void
  isfetching: boolean
}) {
  const { register, control, handleSubmit, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      date: new Date(),
    },
    mode: "onChange",
  })
  const { data: classData } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      // Replace with your API call to fetch classes
      const response = await api.get("/class")
      return response.data as Class[]
    },
  })
  const selectedClass = watch("class")
  const selectedDate = watch("date")
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
                    reset({ class: value, date: new Date() })
                  }}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classData?.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.level} {cls.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {selectedClass && (
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!selectedDate}
                        className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        {...register("date")}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            )}
          </FieldGroup>

          {selectedClass && selectedDate && (
            <Button
              variant="ghost"
              onClick={() => {
                reset({ class: "", date: new Date() })
                handleSubmitProp({ class: "", date: new Date() })
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
            disabled={!selectedClass || !selectedDate || isfetching}
          >
            {isfetching && <LoaderCircle className="h-5 w-5 animate-spin" />}
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
  const [filteredData, setFilteredData] = React.useState<z.infer<
    typeof formSchema
  > | null>(null)

  const { data: attendanceData, isFetching } = useQuery({
    queryKey: ["attendanceData", filteredData],
    queryFn: async () => {
      // Replace with your API call to fetch attendance data based on filters
      const response = await api.get("/attendance", {
        params: {
          class: filteredData?.class, // Assuming class is a property in TData
          date: filteredData?.date, // Assuming date is a property in TData
        },
      })

      return response.data as TData[]
    },
    placeholderData: [],
    enabled: !!filteredData, // Only fetch when both class and date are selected
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setFilteredData(data)
  }
  const handleReset = () => {
    setFilteredData(null)
  }

  const table = useReactTable({
    data: attendanceData || [],
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
      <DataFilter isfetching={isFetching} handleSubmit={handleSubmit} />
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

"use client"
import { useState } from "react"
import {
  type SortingState,
  type VisibilityState,
  type Table as TableType,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
// import { type NavigateFn } from "@/hooks/use-table-url-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table"
// import { roles } from "../data/data"
import { type Student } from "./data/schema"
// import { DataTableBulkActions } from "./data-table-bulk-actions"
import { studentColumns as columns } from "./data/columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "./faceted-filter"
import { X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Class } from "../classes/page"

type DataTableProps = {
  readonly data: Student[]
  // search: Record<string, unknown>
  // navigate: NavigateFn
}
type DataTableToolbarProps<TData> = {
  table: TableType<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter("")
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function StudentsTable({ data }: DataTableProps) {
  const { data: classData } = useQuery({
    queryKey: ["classes"],
    queryFn: () =>
      api.get("/class").then((res) => res.data) as Promise<Class[]>,
  })

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 10,
  // })

  // Synced with URL states (keys/defaults mirror users route search schema)
  // const {
  //   columnFilters,
  //   onColumnFiltersChange,
  //   pagination,
  //   onPaginationChange,
  //   ensurePageInRange,
  // } = useTableUrlState({
  //   search,
  //   navigate,
  //   pagination: { defaultPage: 1, defaultPageSize: 10 },
  //   globalFilter: { enabled: false },
  //   columnFilters: [
  //     // username per-column text filter
  //     { columnId: "username", searchKey: "username", type: "string" },
  //     { columnId: "status", searchKey: "status", type: "array" },
  //     { columnId: "role", searchKey: "role", type: "array" },
  //   ],
  // })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      // pagination,
      rowSelection,
      // columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    // onPaginationChange,
    // onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // useEffect(() => {
  //   ensurePageInRange(table.getPageCount())
  // }, [table, ensurePageInRange])

  return (
    <div className={cn("mt-2.5 flex flex-1 flex-col gap-4")}>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter students..."
        searchKey="full_name"
        filters={[
          {
            columnId: "class",
            title: "Class",
            options:
              classData?.map((cls) => ({
                label: cls.level + " " + cls.section,
                value: cls._id,
              })) || [],
          },
          {
            columnId: "gender",
            title: "Gender",
            options: [
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
              {
                label: "Other",
                value: "other",
              },
            ],
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
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
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      {/* <DataTableBulkActions table={table} /> */}
    </div>
  )
}

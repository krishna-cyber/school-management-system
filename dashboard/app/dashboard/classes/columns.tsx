"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { Class } from "./page"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ArrowUpDown,
  ClipboardClock,
  Ellipsis,
  Mars,
  Trash,
  UserPen,
  Users,
  Venus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>
    title: string
  }
type DataTableRowActionsProps = {
  row: Row<Class>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const { setOpen, setCurrentRow } = useUsers()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
        // onClick={() => {
        //   setCurrentRow(row.original)
        //   setOpen("edit")
        // }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
        // onClick={() => {
        //   setCurrentRow(row.original)
        //   setOpen("edit")
        // }}
        >
          View schedule
          <DropdownMenuShortcut>
            <ClipboardClock size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          // onClick={() => {
          //   setCurrentRow(row.original)
          //   setOpen("delete")
          // }}
          className="text-red-500!"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Class>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn("start-0 z-10 rounded-tl-[inherit] max-md:sticky"),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Class
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "total_students",
    header: "Total Students",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          {" "}
          <Badge
            className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            variant="outline"
          >
            <Users />
            {row.original.totalStudents || 0}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Total: {row.original.totalStudents || 0}
            <br></br>
            Male: {row.original.maleStudents || 0}
            <br></br>
            Female: {row.original.femaleStudents || 0}
            {row.original.otherStudents !== undefined && (
              <>
                <br></br>
                Other: {row.original.otherStudents || 0}
              </>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "compulsory_subjects",
    header: "Compulsory Subjects",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.compulsory_subjects.length}</Badge>
    ),
  },
  {
    accessorKey: "optional_subjects",
    header: "Optional Subjects",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.optional_subjects.length}</Badge>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: () => {
      return <DataTableRowActions row={null as unknown as Row<Class>} />
    },
  },
]

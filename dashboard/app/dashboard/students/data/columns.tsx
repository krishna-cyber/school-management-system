import { type ColumnDef, type Column, type Row } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { LongText } from "@/components/ui/long-text"
import { Button } from "@/components/ui/button"
import {
  AArrowUp,
  AArrowDown,
  ArrowDownUp,
  ArrowUpAZ,
  ArrowDownAZ,
  Trash,
  UserPen,
  Ellipsis,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { type Student } from "./schema"
// import { DataTableRowActions } from "./data-table-row-actions"
type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>
    title: string
  }
type DataTableRowActionsProps = {
  row: Row<Student>
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <AArrowDown className="ms-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <AArrowUp className="ms-2 h-4 w-4" />
            ) : (
              <ArrowDownUp className="ms-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpAZ className="size-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownAZ className="size-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
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

export const studentColumns: ColumnDef<Student>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="StudentName" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 ps-3">{row.getValue("full_name")}</LongText>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "start-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none"
      ),
    },
    enableHiding: false,
  },
  {
    id: "photo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Photo" />
    ),
    cell: ({ row }) => {
      const { full_name } = row.original
      return <LongText className="max-w-36">{full_name}</LongText>
    },
    meta: { className: "w-36" },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="w-fit ps-2 text-nowrap">{row.getValue("gender")}</div>
    ),
  },
  // {
  //   accessorKey: "phoneNumber",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Phone Number" />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  //   enableSorting: false,
  // },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const { status } = row.original
  //     const badgeColor = callTypes.get(status)
  //     return (
  //       <div className="flex space-x-2">
  //         <Badge variant="outline" className={cn("capitalize", badgeColor)}>
  //           {row.getValue("status")}
  //         </Badge>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableHiding: false,
  //   enableSorting: false,
  // },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Role" />
  //   ),
  //   cell: ({ row }) => {
  //     const { role } = row.original
  //     const userType = roles.find(({ value }) => value === role)

  //     if (!userType) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center gap-x-2">
  //         {userType.icon && (
  //           <userType.icon size={16} className="text-muted-foreground" />
  //         )}
  //         <span className="text-sm capitalize">{row.getValue("role")}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "actions",
    header: () => null,
    cell: () => {
      return <DataTableRowActions row={null as unknown as Row<Student>} />
    },
  },
]

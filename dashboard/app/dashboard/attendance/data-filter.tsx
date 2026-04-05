import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react"
const filters = [
  {
    columnId: "class",
    title: "Class",
    options: [
      { label: "Class 1", value: "class1" },
      { label: "Class 2", value: "class2" },
      { label: "Class 3", value: "class3" },
    ],
  },
  {
    columnId: "section",
    title: "Section",
    options: [
      { label: "Section A", value: "sectionA" },
      { label: "Section B", value: "sectionB" },
      { label: "Section C", value: "sectionC" },
    ],
  },
]

const DataFilter = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            return (
              <Select key={filter.columnId} defaultValue="">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filter.title} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

export default DataFilter

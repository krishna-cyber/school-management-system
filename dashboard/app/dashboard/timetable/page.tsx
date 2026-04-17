import React from "react"
import { cn } from "@/lib/utils"

const Page = () => {
  const layout = "fixed" // or "fluid"
  return (
    <>
      <main
        data-layout={layout}
        className={cn(
          "px-4 py-6",

          // If layout is fixed, make the main container flex and grow
          layout === "fixed" && "flex grow flex-col overflow-hidden",

          // If layout is not fluid, set the max-width
          layout != "fixed" &&
            "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl"
        )}
      >
        {/* UsersPrimaryButtons  */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Timetable/Schedule
            </h2>
            <p className="text-muted-foreground">
              View your timetable and schedule for the week here.
            </p>
          </div>

          {/* <Button className="space-x-1" onClick={() => setOpen("add")}> */}
          {/* <Button className="space-x-1">
            <span>Add Teacher</span> <UserPlus size={18} />
          </Button> */}
        </div>
        {/* <TeachersTable data={teachers} /> */}
        {/* <StudentsTable data={students} /> */}
      </main>
      {/* <UsersDialogs /> */}
    </>
  )
}

export default Page

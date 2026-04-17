import { Plus } from "lucide-react"
import { cookies, headers } from "next/headers"
import React from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import RegisterClass from "./register-class"

export interface Subject {
  name: string
  publication: string
}
export interface Class {
  _id: string
  level: number
  section: string
  compulsory_subjects: Subject[]
  optional_subjects: Subject[]
  fees_associated: string[]
  totalStudents?: number
  maleStudents?: number
  femaleStudents?: number
  otherStudents?: number
}

const Page = async () => {
  const cookieStore = (await cookies())
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  const layout = "fixed" // or "fluid"
  const classData = await api
    .get("/class?count_student=true", {
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": data?.user?.tenantId || "",
        cookie: cookieStore,
      },
    })
    .then((res) => res.data as Class[])

  return (
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
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Update and manage attendance records for students here.
          </p>
        </div>

        {/* Register new class form page click  drawer*/}
        <RegisterClass />

        {/* filter section classes and section */}

        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={classData} />
        </div>

        {/* filter section classes and section */}
        {/* <DataTableToolbar
             table={table}
             searchPlaceholder="Filter users..."
             searchKey="username"
             filters={[
               {
                 columnId: "status",
                 title: "Status",
                 options: [
                   { label: "Active", value: "active" },
                   { label: "Inactive", value: "inactive" },
                   { label: "Invited", value: "invited" },
                   { label: "Suspended", value: "suspended" },
                 ],
               },
               {
                 columnId: "role",
                 title: "Role",
                 options: roles.map((role) => ({ ...role })),
               },
             ]}
           /> */}

        {/* If class and section are selected show list with form  otherwise display message select class and section*/}

        {/* <Button className="space-x-1" onClick={() => setOpen("add")}> */}
        {/* <Button className="space-x-1">
             <span>Register Student</span> <UserPlus size={18} />
           </Button> */}
      </div>
      {/* <StudentsTable data={students} /> */}
    </main>
  )
}

export default Page

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download } from "lucide-react"
import Link from "next/link"
import React from "react"
import AdmissionForm from "./admission-form"

const Page = () => {
  const layout = "fixed" // or "fluid"
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
          <h2 className="text-2xl font-bold tracking-tight">
            Student Admission
          </h2>
          <p className="text-muted-foreground">
            Register new students and fill their admission details here.
          </p>
        </div>

        {/* <Button className="space-x-1" onClick={() => setOpen("add")}> */}
        <Button asChild className="space-x-1">
          <Link href="/dashboard/admissions">
            <span>Download Admission Form</span> <Download size={18} />
          </Link>
        </Button>
      </div>
      {/* admission form below */}
      <AdmissionForm />
      {/* <StudentsTable data={students} /> */}
    </main>
  )
}

export default Page

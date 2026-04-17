"use client"
import { ImportIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import FileUploadMotion from "@/components/shadcn-space/radix/file-upload/file-upload-01"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ImportStudentFromFile = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [open, setOpen] = React.useState(false)
  const getFile = (file: File) => {
    setFile(file)
  }
  const handleSubmit = () => {
    if (!file) {
      alert("Please select a file first")
      return
    }
    // Handle the file submission logic here
    console.log("File submitted", file)

    setOpen(false)
    setFile(null) // ✅ clear file
  }

  const handleClose = () => {
    setOpen(false)
    setFile(null) // ✅ clear file
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button>
          Import From File <ImportIcon size={18} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Import students</DrawerTitle>
          <DrawerDescription>
            Import student data from a excel file.
          </DrawerDescription>
        </DrawerHeader>
        <FileUploadMotion handleSubmit={getFile} />

        <DrawerFooter>
          <Button disabled={!file} onClick={handleSubmit}>
            Submit
          </Button>
          <DrawerClose asChild>
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ImportStudentFromFile

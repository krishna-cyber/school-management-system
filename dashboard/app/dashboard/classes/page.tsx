import React from "react"

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
}

const Page = () => {
  return <div>Page</div>
}

export default Page

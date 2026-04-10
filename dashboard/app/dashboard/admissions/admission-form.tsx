"use client"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone } from "lucide-react"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod/v3"

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  photo: z.string().optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Address too long"),
  class: z.string(),
  parent: z.object({
    full_name: z.string().min(1, "Parent's full name is required"),
    contact: z.object({
      phone_number: z
        .array(z.string().min(1))
        .min(1, "At least one phone number is required"),
      email: z
        .array(
          z
            .string()
            .refine(
              (val) => !val || z.string().email().safeParse(val).success,
              {
                message: "Invalid email address",
              }
            )
        )
        .default([]),
    }),
    occupation: z.string().optional(),
    photo: z.string().optional(),
    qualification: z
      .enum([
        "slc",
        "intermediate",
        "bachelor",
        "master",
        "phd",
        "illiterate",
        "other",
      ])
      .optional(),
  }),
})

type AdmissionFormInput = z.input<typeof formSchema>
type AdmissionFormValues = z.output<typeof formSchema>

const AdmissionForm = () => {
  const form = useForm<AdmissionFormInput, unknown, AdmissionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      gender: "male",
      photo: "",
      address: "",
      class: "",
      parent: {
        full_name: "",
        contact: {
          phone_number: [""],
          email: [""],
        },
        occupation: "",
        photo: "",
        qualification: "illiterate",
      },
    },
  })

  function onSubmit(data: AdmissionFormValues): void {
    console.log("form submitted with data", data)
    // Do something with the form values.
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        id="admission-form"
        className="flex flex-col gap-3 py-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Please fill in the student&apos;s basic information below.
        </CardDescription>
        {/* ... */}
        <Separator />
        {/* ... */}
        {/* Build the form here */}
        {/* ... */}

        {/* Two-column on md+, single column on mobile */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="full_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name:</FieldLabel>
                <Input
                  required
                  {...field}
                  id={field.name}
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gender:</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Genders</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="class"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Class:</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classes</SelectLabel>
                      <SelectItem value="kindergarten">Kindergarten</SelectItem>
                      <SelectItem value="first-grade">First Grade</SelectItem>
                      <SelectItem value="second-grade">Second Grade</SelectItem>
                      <SelectItem value="third-grade">Third Grade</SelectItem>
                      <SelectItem value="fourth-grade">Fourth Grade</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel htmlFor={field.name}>Address:</FieldLabel>
                <Input
                  required
                  {...field}
                  id={field.name}
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="date_of_birth"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-1"
              >
                <FieldLabel htmlFor={field.name}>Date of Birth:</FieldLabel>
                <Input
                  required
                  {...field}
                  id={field.name}
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Separator />
        <CardTitle>Parent Information</CardTitle>
        <CardDescription>
          Please fill in the parent&apos;s information below.
        </CardDescription>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="parent.full_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name:</FieldLabel>
                <Input
                  required
                  {...field}
                  id={field.name}
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent.occupation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Occupation:</FieldLabel>
                <Input
                  required
                  {...field}
                  id={field.name}
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent.qualification"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Qualification:</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Qualifications</SelectLabel>
                      <SelectItem value="slc">SLC</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="illiterate">Illiterate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="parent.contact.phone_number.0"
            control={form.control}
            render={({ field }) => (
              <div className="w-full max-w-sm space-y-2">
                <Label htmlFor={field.name}>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    className="bg-background pl-9"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: +1 (555) 000-0000
                </p>
              </div>
            )}
          />
          <Controller
            name="parent.contact.email.0"
            control={form.control}
            render={({ field }) => (
              <div className="w-full max-w-sm space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    className="bg-background pl-9"
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: john.doe@example.com
                </p>
              </div>
            )}
          />
        </div>
        <Separator />
        {/* terms and conditions check */}
        <div className="w-full max-w-md">
          <Field orientation="horizontal">
            <Checkbox id="terms" />
            <FieldLabel className="font-normal" htmlFor="terms">
              I agree to the terms and conditions
            </FieldLabel>
          </Field>
        </div>
        <Button className="ml-auto w-fit" type="submit" form="admission-form">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default AdmissionForm

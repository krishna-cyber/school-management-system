"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, XIcon } from "lucide-react"
import React from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import z from "zod/v3"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Form, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  level: z.enum(
    [
      "nursery",
      "LKG",
      "UKG",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    {
      errorMap: () => ({
        message: "Level is required and must be a valid option",
      }),
    }
  ),
  section: z.string().default("A"),
  compulsory_subjects: z.array(
    z.object({
      name: z.string().min(1, "Subject name is required"),
      publication: z.string().default("").optional(),
    })
  ),
  optional_subjects: z.array(
    z.object({
      name: z.string().min(1, "Subject name is required"),
      publication: z.string().default("").optional(),
    })
  ),
  fees_associated: z
    .array(z.string().min(1, "Fee description is required"))
    .optional(),
})

type ClassFormInput = z.input<typeof formSchema>
type ClassFormValues = z.output<typeof formSchema>

const RegisterClass = () => {
  const form = useForm<ClassFormInput, unknown, ClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "1",
      section: "A",
      compulsory_subjects: [],
      optional_subjects: [],
      fees_associated: [],
    },
  })

  const {
    fields: compulsoryFields,
    append: compulsoryAppend,
    remove: compulsoryRemove,
  } = useFieldArray({
    control: form.control,
    name: "compulsory_subjects",
    rules: { maxLength: 5 },
  })

  const {
    fields: optionalFields,
    append: optionalAppend,
    remove: optionalRemove,
  } = useFieldArray({
    control: form.control,
    name: "optional_subjects",
    rules: { maxLength: 3 },
  })

  const onSubmit = (data: ClassFormValues) => {
    console.log("Form submitted with data:", data)
    // Here you would typically send the data to your backend API
  }

  const [open, setOpen] = React.useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button className="space-x-1">
          <span>Register New Class</span> <Plus size={18} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" min-w-[50%] ">
        {/* Form content goes here */}
        <div className="no-scrollbar overflow-y-auto px-4">
          <Form {...form}>
            <form
              className="flex flex-col gap-3 py-3 px-4"
              id="class-register-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <DrawerHeader>
                <DrawerTitle>Basic Class Information</DrawerTitle>
                <DrawerDescription>
                  Provide the basic information about the class, including the
                  level and section.
                </DrawerDescription>
              </DrawerHeader>
              <Separator />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Controller
                  name="level"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Level</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nursery">Nursery</SelectItem>
                            <SelectItem value="LKG">LKG</SelectItem>
                            <SelectItem value="UKG">UKG</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )
                  }}
                />

                <Controller
                  name="section"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Section:</FieldLabel>
                      <Input
                        required
                        {...field}
                        id={field.name}
                        type="text"
                        value={"A"}
                        disabled
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Separator />
              <FieldSet>
                <FieldLegend>Compulsory Subjects</FieldLegend>
                <FieldDescription>
                  Add compulsory subjects for this class. You can add up to 5.
                </FieldDescription>
                <FieldGroup>
                  {compulsoryFields.map((field, index) => (
                    <>
                      <div
                        key={field.id}
                        className=" flex  gap-4  items-center "
                      >
                        <Controller
                          name={`compulsory_subjects.${index}.name`}
                          control={form.control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field>
                              <FieldContent>
                                <FormLabel
                                  htmlFor={`class-register-form-array-compulsory-${index}`}
                                >
                                  Subject Name:
                                </FormLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...controllerField}
                                    id={`class-register-form-array-compulsory-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Subject Name"
                                    type="text"
                                  />
                                </InputGroup>
                              </FieldContent>
                            </Field>
                          )}
                        />
                        <Controller
                          name={`compulsory_subjects.${index}.publication`}
                          control={form.control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field>
                              <FieldContent>
                                <FormLabel
                                  htmlFor={`class-register-form-array-compulsory-${index}`}
                                >
                                  Publication (optional):
                                </FormLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...controllerField}
                                    id={`class-register-form-array-compulsory-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Publication (optional)"
                                    type="text"
                                  />
                                </InputGroup>
                              </FieldContent>
                            </Field>
                          )}
                        />
                        {compulsoryFields.length >= 1 && (
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => compulsoryRemove(index)}
                              aria-label={`Remove compulsory subject ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </div>
                      <Separator className="my-2 md:col-span-2" />
                    </>
                  ))}
                  <Button
                    type="button"
                    variant="link"
                    className="w-fit ml-auto"
                    size="sm"
                    onClick={() =>
                      compulsoryAppend({ name: "", publication: "" })
                    }
                    disabled={compulsoryFields.length >= 5}
                  >
                    <Plus size={14} />
                    Add Compulsory Subject
                  </Button>
                </FieldGroup>
              </FieldSet>
              <Separator />
              <FieldSet>
                <FieldLegend>Optional Subjects</FieldLegend>
                <FieldDescription>
                  Add optional subjects for this class.
                </FieldDescription>

                <FieldGroup>
                  {optionalFields.map((field, index) => (
                    <>
                      <div
                        key={field.id}
                        className=" flex  gap-4  items-center "
                      >
                        <Controller
                          name={`optional_subjects.${index}.name`}
                          control={form.control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field>
                              <FieldContent>
                                <FormLabel
                                  htmlFor={`class-register-form-array-optional-${index}`}
                                >
                                  Subject Name:
                                </FormLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...controllerField}
                                    id={`class-register-form-array-optional-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Subject Name"
                                    type="text"
                                  />
                                </InputGroup>
                              </FieldContent>
                            </Field>
                          )}
                        />
                        <Controller
                          name={`optional_subjects.${index}.publication`}
                          control={form.control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field>
                              <FieldContent>
                                <FormLabel
                                  htmlFor={`class-register-form-array-optional-${index}`}
                                >
                                  Publication (optional):
                                </FormLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...controllerField}
                                    id={`class-register-form-array-optional-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Publication (optional)"
                                    type="text"
                                  />
                                </InputGroup>
                              </FieldContent>
                            </Field>
                          )}
                        />
                        {optionalFields.length >= 1 && (
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => optionalRemove(index)}
                              aria-label={`Remove optional subject ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </div>
                      <Separator className="my-2 md:col-span-2" />
                    </>
                  ))}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() =>
                      optionalAppend({ name: "", publication: "" })
                    }
                    disabled={optionalFields.length >= 3}
                  >
                    <Plus size={14} />
                    Add Optional Subject
                  </Button>
                </FieldGroup>
              </FieldSet>
            </form>
            {/* Form fields will be implemented here */}
          </Form>
        </div>
        <DrawerFooter>
          <Button type="submit" form="class-register-form">
            Submit
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                form.reset()
                setOpen(!open)
              }}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default RegisterClass

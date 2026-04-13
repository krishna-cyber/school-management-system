import { unlink } from 'node:fs'
import { Processor, WorkerHost } from '@nestjs/bullmq'

import { Job } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { Types } from 'mongoose'

import { Class, ClassSchema } from 'src/class/schemas/class.schema'
import { logger } from 'src/logger.service'
import { TenantConnectionService } from 'src/providers/tenant.connection.service'
import { readFile, utils } from 'xlsx'
import { ImportParentDto, ImportStudentDto } from './dto/import-student.dto'
import { Student, StudentSchema } from './schemas/student.schema'

export interface ImportJobData {
  filePath: string
  fileName: string
  fileSize: number
  timestamp: Date
  tenantId: string
}

@Processor('studentImportQueue', { concurrency: 5 })
export class StudentProcessor extends WorkerHost {
  constructor(
    private readonly tenantConnectionProvider: TenantConnectionService,
  ) {
    super()
  }
  async process(job: Job<ImportJobData>) {
    const { filePath, tenantId } = job.data
    try {
      //step1: read the Excel file
      const workbook = readFile(filePath)
      const studentSheet = workbook.Sheets['students']
      const parentSheet = workbook.Sheets['parents']

      logger.info('Started processing import job', {
        jobId: job.id,
        filePath,
        tenantId,
      })
      // step2: Extract data from sheets
      const studentData = utils.sheet_to_json(studentSheet, {
        header: [
          'full_name',
          'date_of_birth',
          'gender',
          'class',
          'address',
          'photo',
        ],
        range: 1, //skip the header row
        defval: null, //set default value for empty cells to null
      })
      const parentData = utils.sheet_to_json(parentSheet, {
        header: [
          'full_name',
          'photo',
          'occupation',
          'qualification',
          'phone_number',
          'email',
        ],
        range: 1, //skip the header row
        defval: null, //set default value for empty cells to null
      })

      // step3: check if the required sheets are present and have data
      // check both worksheet is required and both have equal number of rows
      if (
        !studentSheet ||
        !parentSheet ||
        studentData.length !== parentData.length
      ) {
        logger.error('Invalid Excel file format', {
          jobId: job.id,
          filePath,
          tenantId,
          reason:
            'One or more required sheets (students, parents) are missing or they have unequal number of records in the Excel file.',
        })
        return
      }

      const studentDto = plainToInstance(ImportStudentDto, studentData, {
        enableImplicitConversion: true,
      })
      const parentDto = plainToInstance(ImportParentDto, parentData, {
        enableImplicitConversion: true,
      })
      const errors: {
        student: ValidationError[]
        parent: ValidationError[]
      } = {
        student: [],
        parent: [],
      }
      const documents: Student[] = []

      //get tenant specific student model and class model
      const tenantConnection =
        this.tenantConnectionProvider.getConnection(tenantId)
      const StudentModel = tenantConnection.model(Student.name, StudentSchema)
      const ClassModel = tenantConnection.model(Class.name, ClassSchema)

      //get all the classes here single db call
      const classData = await ClassModel.find().select('_id level section')

      console.log('class data', classData)

      const classMap = new Map<string, Types.ObjectId>()

      classData.forEach((cls) => {
        const key = `${cls.level}`.toLowerCase()
        classMap.set(key, cls._id)
      })
      // step 4 : validate all the records and prepare the documet to insert in db. rather than validating and inserting one by one, we will validate all the records first and then insert all the valid records in one go to minimize the db calls

      for (let i = 0; i < studentDto.length; i++) {
        const studentErrors = await validate(studentDto[i], {
          whitelist: true,
          forbidNonWhitelisted: true,
        })
        const parentErrors = await validate(parentDto[i], {
          whitelist: true,
          forbidNonWhitelisted: true,
        })
        const classKey = studentDto[i].class?.toLowerCase() // normalize "10 A" → "10-A"

        const classId = classMap.get(classKey)
        if (studentErrors.length > 0 || parentErrors.length > 0 || !classId) {
          errors.student.push(...studentErrors)
          errors.parent.push(...parentErrors)
        } else {
          documents.push({
            full_name: studentDto[i].full_name,
            date_of_birth: studentDto[i].date_of_birth,
            gender: studentDto[i].gender,
            class: classId,
            address: studentDto[i].address,
            photo: studentDto[i].photo || null,
            parent: {
              full_name: parentDto[i].full_name,
              photo: parentDto[i].photo || null,
              occupation: parentDto[i].occupation,
              qualification: parentDto[i].qualification,
              contact: {
                phone_number: parentDto[i].phone_number,
                email: parentDto[i].email,
              },
            },
          })
        }
      }

      await StudentModel.insertMany(documents, { ordered: false })

      logger.info('Import job completed successfully', {
        jobId: job.id,
        filePath,
        tenantId,
        totalRecords: studentDto.length,
        successfulInserts: documents.length,
        validationErrors: errors,
        timestamp: job.data?.timestamp,
      })
    } catch (error) {
      logger.error('Error processing studentimport job', {
        jobId: job.id,
        filePath,
        tenantId,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      unlink(filePath, (err) => {
        if (err) {
          logger.error('Error deleting file after processing', {
            jobId: job.id,
            filePath,
            tenantId,
            error: err.message,
          })
        } else {
          logger.info('File deleted successfully after processing', {
            jobId: job.id,
            filePath,
            tenantId,
          })
        }
      })
    }
  }
}

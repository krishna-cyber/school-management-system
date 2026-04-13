import { Processor, WorkerHost } from '@nestjs/bullmq'
import { BadRequestException, Inject } from '@nestjs/common'
import { Job } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { Model } from 'mongoose'
import { logger } from 'src/logger.service'
import { ImportJobData } from 'src/student/student.worker'
import { readFile, utils } from 'xlsx'
import { ImportTeacherDto } from './dto/import-teachet.dto'
import { Teacher } from './schemas/teacher.schema'

@Processor('teacherImportQueue', { concurrency: 5 })
export class TeacherProcessor extends WorkerHost {
  constructor(
    @Inject('TEACHER_MODEL') private readonly teacherModel: Model<Teacher>,
  ) {
    super()
  }
  async process(job: Job<ImportJobData>) {
    const workbook = readFile(job.data?.filePath)
    const teacherSheet = workbook.Sheets['teachers']

    const teacherData = utils.sheet_to_json(teacherSheet, {
      header: [
        'full_name',
        'gender',
        'salary',
        'phone_number',
        'email',
        'photo',
        'qualification',
      ],
      range: 1, //skip the header row
      defval: null, //set default value for empty cells to null
    })

    if (!teacherSheet || teacherData.length === 0) {
      throw new BadRequestException(
        'verify the excel file once for required format and data consistency',
      )
    }

    const teacherDto = plainToInstance(ImportTeacherDto, teacherData, {
      enableImplicitConversion: true,
    })

    const errors: ValidationError[] = []
    const documents: Teacher[] = []

    for (const element of teacherDto) {
      const teacherError = await validate(element, {
        whitelist: true,
        forbidNonWhitelisted: true,
      })
      if (teacherError.length > 0) {
        errors.push(...teacherError)
      } else {
        documents.push({
          full_name: element.full_name,
          gender: element.gender,
          salary: element.salary,
          photo: element.photo,
          qualification: element.qualification,
          contact: {
            phone_number: element.phone_number.split('|'),
            email: element.email.split('|'),
          },
        })
      }

      await this.teacherModel.insertMany(documents, { ordered: false })

      logger.info('Import job completed successfully', {
        fileSize: job.data?.fileSize,
        timestamp: job.data?.timestamp,
        totalRecords: teacherDto.length,
        successfulInserts: documents.length,
        validationErrors: errors,
      })
    }
  }
}

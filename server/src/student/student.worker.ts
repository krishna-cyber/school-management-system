import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Student } from './schemas/student.schema';
import { validate, ValidationError } from 'class-validator';
import { readFile, utils } from 'xlsx';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ImportParentDto, ImportStudentDto } from './dto/import-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { logger } from '@sentry/nestjs';

interface ImportJobData {
  filePath: string;
  fileName: string;
  fileSize: number;
  timestamp: Date;
}

@Processor('importQueue', { concurrency: 5 })
export class StudentProcessor extends WorkerHost {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
  ) {
    super();
  }
  async process(job: Job<ImportJobData>) {
    const workbook = readFile(job.data?.filePath);
    const studentSheet = workbook.Sheets['students'];
    const parentSheet = workbook.Sheets['parents'];

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
    });
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
    });

    // check both worksheet is required and both have equal number of rows
    if (
      !studentSheet ||
      !parentSheet ||
      studentData.length !== parentData.length
    ) {
      throw new BadRequestException(
        'verify the excel file once for required format and data consistency',
      );
    }

    const studentDto = plainToInstance(ImportStudentDto, studentData, {
      enableImplicitConversion: true,
    });
    const parentDto = plainToInstance(ImportParentDto, parentData, {
      enableImplicitConversion: true,
    });

    const errors: {
      student: ValidationError[];
      parent: ValidationError[];
    } = {
      student: [],
      parent: [],
    };
    const documents: Student[] = [];

    for (let i = 0; i < studentDto.length; i++) {
      const studentErrors = await validate(studentDto[i], {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const parentErrors = await validate(parentDto[i], {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const classId = await this.classModel
        .findOne({ level: studentDto[i].class })
        .select('_id');

      if (studentErrors.length > 0 || parentErrors.length > 0 || !classId) {
        errors.student.push(...studentErrors);
        errors.parent.push(...parentErrors);
      } else {
        documents.push({
          full_name: studentDto[i].full_name,
          date_of_birth: studentDto[i].date_of_birth,
          gender: studentDto[i].gender,
          class: String(classId?._id),
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
        });
      }
    }

    await this.studentModel.insertMany(documents);

    logger.info('Import job completed successfully', {
      fileName: job.data?.fileName,
      fileSize: job.data?.fileSize,
      timestamp: job.data?.timestamp,
      totalRecords: studentDto.length,
      successfulInserts: documents.length,
      validationErrors: errors,
    });
  }
}

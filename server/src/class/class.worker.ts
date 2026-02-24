import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, ValidationError } from '@nestjs/common';
import { Job } from 'bullmq';
import { ImportJobData } from 'src/student/student.worker';
import { readFile, utils } from 'xlsx';
import { Class } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { validate } from 'class-validator';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { logger } from '@sentry/nestjs';

interface ClassData {
  class_key: string;
  level: string;
  section: string;
}

interface SubjectData {
  class_key: string;
  subject_name: string;
  publication: string;
}

@Processor('classImportQueue', { concurrency: 5 })
export class ClassProcessor extends WorkerHost {
  constructor(
    @Inject('CLASS_MODEL') private readonly classModel: Model<Class>,
  ) {
    super();
  }
  async process(job: Job<ImportJobData>) {
    const workbook = readFile(job.data?.filePath);
    const classSheet = workbook.Sheets['classes'];
    const compulsorySubjectSheet = workbook.Sheets['compulsory_subjects'];
    const optionalSubjectSheet = workbook.Sheets['optional_subjects'];

    if (!classSheet || !compulsorySubjectSheet || !optionalSubjectSheet) {
      throw new Error(
        'One or more required sheets (classes, compulsory_subjects, optional_subjects) are missing in the Excel file.',
      );
    }

    const classData: ClassData[] = utils.sheet_to_json(classSheet, {
      header: ['class_key', 'level', 'section'],
      range: 1, //skip the header row
      defval: null, //set default value for empty cells to null
    });
    const compulsorySubjectsData: SubjectData[] = utils.sheet_to_json(
      compulsorySubjectSheet,
      {
        header: ['class_key', 'subject_name', 'publication'],
        range: 1, //skip the header row
        defval: null, //set default value for empty cells to null
      },
    );
    const optionalSubjectsData: SubjectData[] = utils.sheet_to_json(
      optionalSubjectSheet,
      {
        header: ['class_key', 'subject_name', 'publication'],
        range: 1, //skip the header row
        defval: null, //set default value for empty cells to null
      },
    );

    //recombine the data based on class_key
    const errors: ValidationError[] = [];
    const validDocuments: Class[] = [];

    for (const classItem of classData) {
      const classKey = classItem.class_key;
      const compulsorySubjects = compulsorySubjectsData.filter((subject) => {
        return subject.class_key === classKey;
      });
      const optionalSubjects = optionalSubjectsData.filter(
        (subject) => subject.class_key === classKey,
      );

      const classDto = plainToInstance(
        CreateClassDto,
        {
          level: classItem.level,
          section: classItem.section,
          compulsory_subjects: compulsorySubjects.map((subject) => {
            return {
              name: subject.subject_name,
              publication: subject.publication,
            };
          }),
          optional_subjects: optionalSubjects.map((subject) => {
            return {
              name: subject.subject_name,
              publication: subject.publication,
            };
          }),
        },
        { enableImplicitConversion: true },
      );

      const classError = await validate(classDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (classError.length > 0) {
        errors.push(...classError);
      } else {
        validDocuments.push({
          level: classDto.level,
          section: classDto.section,
          compulsory_subjects: classDto.compulsory_subjects.map((subject) => {
            return {
              name: subject.name,
              publication: subject.publication,
            };
          }),
          optional_subjects: classDto.optional_subjects.map((subject) => {
            return {
              name: subject.name,
              publication: subject.publication,
            };
          }),
        });
      }
    }

    let successCount: number = 0;
    let failedCount: number = 0;
    try {
      await this.classModel.insertMany(validDocuments, {
        ordered: false,
      });
    } catch (error: unknown) {
      const err = error as {
        insertedDocs?: any[];
        writeErrors?: any[];
      };

      successCount = err.insertedDocs?.length ?? 0;
      failedCount = err.writeErrors?.length ?? 0;
    }

    logger.info('Class import job completed', {
      validatedDocuments: validDocuments,
      validationErrors: errors,
      successCount,
      failedCount,
    });

    return {
      validatedDocuments: validDocuments,
      validationErrors: errors,
      successCount,
      failedCount,
    };
  }
}

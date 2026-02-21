import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Student } from 'src/student/schemas/student.schema';
import { CreateMarkSheetDto } from './dto/create-marksheet.dto';
import { Marksheet } from './schemas/marksheet.schema';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { MarksheetJobData } from './exam.worker';
import type { Cache } from 'cache-manager';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Marksheet.name)
    private readonly marksheetModel: Model<Marksheet>,
    @InjectQueue('marksheetGeneration')
    private readonly marksheetQueue: Queue,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}
  async saveMarksheet(id: string, createMarkSheetDto: CreateMarkSheetDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid student ID');
    }
    const existingUser = await this.studentModel
      .findById(id)
      .setOptions({ autopopulate: false });

    if (!existingUser || existingUser?.class !== createMarkSheetDto.class) {
      throw new BadRequestException('Student not found or class not match.');
    }

    const newMarkSheet = new this.marksheetModel({
      student: id,
      exam: createMarkSheetDto.exam,
      class: createMarkSheetDto.class,
      subjects: createMarkSheetDto.subjects,
    });

    await newMarkSheet.save();

    return {
      success: true,
      message: 'Marksheet generated successfully',
      data: newMarkSheet,
    };
  }

  async generateMarksheet(studentId: string, examId: string) {
    const marksheet = await this.marksheetModel
      .findOne({ student: studentId, exam: examId })
      .lean()
      .populate('student', 'full_name ,-_id')
      .populate('class', 'level ,-_id');

    if (!marksheet) {
      throw new BadRequestException(
        'Marksheet not found for the given student and exam',
      );
    }

    const job = await this.marksheetQueue.add('marksheetGeneration', marksheet);

    return {
      success: true,
      message: 'Marksheet generation job has been added.',
      jobId: job.id,
    };
  }

  async getMarksheet(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marksheet ID');
    }
    const marksheet = await this.marksheetModel
      .findOne({ student: id })
      .lean()
      .populate('student', 'full_name ,-_id')
      .populate('class', 'level ,-_id');

    if (!marksheet) {
      throw new BadRequestException('Marksheet not found');
    }

    return {
      success: true,
      message: 'Marksheet retrieved successfully',
      data: marksheet,
    };
  }

  async previewMarksheet(id: string) {
    const job = await this.marksheetQueue.getJob(id);

    if (!job || !(await job.isCompleted())) {
      throw new BadRequestException('Job not found or not completed yet');
    }

    const jobData = job.data as MarksheetJobData;

    const marksheet = await this.cacheManager.get<Uint8Array>(
      `marksheet:${jobData.student.full_name}:${jobData.class.level}:${jobData.exam}`,
    );

    if (!marksheet) {
      throw new BadRequestException('Marksheet not found in cache');
    }

    return Buffer.isBuffer(marksheet)
      ? marksheet
      : Buffer.from(Object.values(marksheet));
  }
}

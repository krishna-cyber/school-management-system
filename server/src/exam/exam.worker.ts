import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs';
import { Marksheet } from './schemas/marksheet.schema';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { hours } from '@nestjs/throttler';

export interface MarksheetJobData extends Omit<Marksheet, 'student' | 'class'> {
  student: {
    full_name: string;
  };
  class: {
    level: string;
  };
}

@Processor('marksheetGeneration', { concurrency: 5 })
export class MarksheetWorker extends WorkerHost {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {
    super();
  }

  async process(job: Job) {
    const marksheet = job.data as MarksheetJobData;
    const templatePath = path.join(
      __dirname,
      '../templates/marksheet.template.hbs',
    );

    const imageBase64 = fs.readFileSync(
      path.join(__dirname, '../templates/logo.png'),
      'base64',
    );

    const templateData = {
      date: new Date().toISOString().split('T')[0],
      schoolName: 'Durga Laxmi Model School',
      schoolAddress: 'Godawari-04, Attariya, Kailali',
      logo: imageBase64,
      examTitle: 'Final Exam',
      subjects: marksheet.subjects,
      examYear: '2082',
      studentName: marksheet.student.full_name.toUpperCase(),
      class: marksheet.class.level,
      rollNumber: '1',
      section: 'A',
      percentage: marksheet.percentage?.toFixed(2),
      totalObtained: marksheet.obtained_marks,
      result: marksheet.is_pass ? 'Pass' : 'Fail',
      remarks: marksheet.remarks,
    };

    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const template = Handlebars.compile(templateContent);
    Handlebars.registerHelper('inc', function (value: number): number {
      return value + 1;
    });

    const html = template(templateData);

    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    await this.cacheManager.set(
      `marksheet:${marksheet.student.full_name}:${marksheet.class.level}:${marksheet.exam}`,
      pdfBuffer,
      hours(1),
    );
  }
}

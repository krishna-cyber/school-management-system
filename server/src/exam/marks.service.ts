import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Student } from 'src/student/schemas/student.schema';
import { CreateMarkSheetDto } from './dto/create-marksheet.dto';
import { Marksheet } from './schemas/marksheet.schema';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs';

interface MarksheetPopulated extends Omit<Marksheet, 'student' | 'class'> {
  student: {
    full_name: string;
  };
  class: {
    level: string;
  };
}

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Marksheet.name)
    private readonly marksheetModel: Model<Marksheet>,
  ) {}
  async generateMarkSheet(id: string, createMarkSheetDto: CreateMarkSheetDto) {
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

  async getMarksheet(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marksheet ID');
    }
    const marksheet = await this.marksheetModel
      .findOne({ student: id })
      .lean()
      .populate('student', 'full_name ,-_id')
      .populate<MarksheetPopulated>('class', 'level ,-_id');

    if (!marksheet) {
      throw new BadRequestException('Marksheet not found');
    }

    return {
      success: true,
      data: marksheet,
    };
  }

  async previewMarksheet(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid marksheet ID');
    }

    const marksheet = await this.marksheetModel
      .findOne({ student: id })
      .lean()
      .populate('student', 'full_name ,-_id')
      .populate<MarksheetPopulated>('class', 'level ,-_id');

    const templatePath = path.join(
      __dirname,
      './templates/marksheet-template.hbs',
    );
    const imageBase64 = fs.readFileSync(
      './src/exam/templates/logo.png',
      'base64',
    );

    console.log('Marksheet data:', marksheet);

    if (marksheet) {
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

      return pdfBuffer;
    } else {
      throw new BadRequestException('Marksheet not found');
    }
  }
}

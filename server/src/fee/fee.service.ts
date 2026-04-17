import fs from 'node:fs'
import path from 'node:path'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as Handlebars from 'handlebars'
import { Model, Types } from 'mongoose'
import * as puppeteer from 'puppeteer'
import { Student } from 'src/student/schemas/student.schema'
import { CreateFeeDto } from './dto/create-fee.dto'
import { UpdateFeeDto } from './dto/update-fee.dto'
import { Fee } from './schemas/fee-structure.schema'

interface Invoice {
  date: string
  logo: string
  schoolName: string
  schoolAddress: string
  schoolContact: string
  invoiceNumber: string
  panNumber: string[]
  studentName: string
  class: string
  rollNumber?: string
  section: string
  invoices: { description: string; amount: number; remark?: string }[]
  totalAmount: number
  amountInWords: string
  pageNumber: number
  totalPages: number
}

@Injectable()
export class FeeService {
  constructor(
    @Inject('FEE_MODEL') private readonly feeModel: Model<Fee>,
    @Inject('STUDENT_MODEL') private readonly studentModel: Model<Student>,
  ) {}
  async create(createFeeDto: CreateFeeDto) {
    const createdFee = new this.feeModel(createFeeDto)
    await createdFee.save()
    return {
      success: true,
      message: 'Fee created successfully',
    }
  }

  async findAll(studentId?: string) {
    if (studentId) {
      const student = await this.studentModel
        .findById(studentId)
        .populate({
          path: 'class',
          populate: {
            path: 'fees_associated',
            model: Fee.name,
          },
        })
        .populate('extra_fees')

      if (!student) {
        throw new BadRequestException('Student not found')
      }
      const associatedFees = [
        ...new Set([
          ...(student.class?.fees_associated || []),
          ...(student.extra_fees || []),
        ]),
      ]

      return {
        success: true,
        message: 'Fees for the student retrieved successfully',
        data: associatedFees,
      }
    }

    return {
      success: true,
      message: 'All fees retrieved successfully',
      data: await this.feeModel.find().sort({ createdAt: -1 }),
    }
  }

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid fee ID')
    }

    return this.feeModel.findById(id)
  }

  update(id: string, updateFeeDto: UpdateFeeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid fee ID')
    }
    return this.feeModel.findByIdAndUpdate(id, updateFeeDto, { new: true })
  }

  remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid fee ID')
    }
    return this.feeModel.findByIdAndDelete(id)
  }

  async generateInvoice(studentId: string) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new BadRequestException('Invalid student ID')
    }

    const templatePath = path.join(
      __dirname,
      '../templates/invoice.template.hbs',
    )

    const imageBase64 = fs.readFileSync(
      path.join(__dirname, '../templates/logo.png'),
      'base64',
    )
    const invoice: Invoice = {
      date: new Date().toLocaleDateString(),
      logo: imageBase64,
      schoolName: 'Durga Laxmi Secondary School',
      schoolAddress: 'Godawari-04, Attariya',
      schoolContact: '091-550700',
      invoiceNumber: '810712001',
      panNumber: '123456'.split(''),
      studentName: 'KRISHNA TIWARI',
      class: '8',
      rollNumber: '12',
      section: 'A',
      invoices: [
        {
          description: 'Tuition Fee for the month of September 2024',
          amount: 5225,
        },
        {
          description: 'Library Fee for the month of September 2024',
          amount: 700,
        },
        {
          description: 'Lab Fee for the month of September 2024',
          amount: 500,
        },
      ],
      totalAmount: 6425,
      amountInWords: 'Six Thousand Four Hundred Twenty Five Only',
      pageNumber: 1,
      totalPages: 1,
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8')

    const template = Handlebars.compile(templateContent)
    Handlebars.registerHelper('inc', (value: number): number => value + 1)

    const html = template(invoice)

    const browser = await puppeteer.launch({ headless: true })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({ format: 'A4' })

    await browser.close()
    // Logic to generate invoice for the student
    return pdfBuffer
  }

  async feeDeposit(createFeeDto: CreateFeeDto) {
    // Logic to handle fee deposit
    const createdFee = new this.feeModel(createFeeDto)
    await createdFee.save()
    return {
      success: true,
      message: 'Fee deposited successfully',
    }
  }
}

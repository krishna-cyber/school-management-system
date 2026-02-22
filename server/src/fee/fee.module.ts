import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fee, FeeSchema } from './schemas/fee.schema';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fee.name, schema: FeeSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}

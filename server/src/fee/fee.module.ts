import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fee, FeeSchema } from './schemas/fee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Fee.name,
        schema: FeeSchema,
      },
    ]),
  ],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fee, FeeSchema } from './schemas/fee.schema';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';

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
export class FeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(FeeController);
  }
}

import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentDataTransferService } from './student-data-transfer.service';
import { BullModule } from '@nestjs/bullmq';
import { StudentProcessor } from './student.worker';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { ClassModule } from 'src/class/class.module';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { ModelProvider } from 'src/providers/tenant-models.provider';

@Module({
  imports: [
    ClassModule,
    BullModule.registerQueue({ name: 'importQueue' }),
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter(req, file, callback) {
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only Excel files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './uploads');
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname);
          const filename = `${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    StudentDataTransferService,
    StudentProcessor,
    TenantConnectionProvider,
    ModelProvider.studentModel,
    ModelProvider.classModel,
  ],
  exports: [],
})
// export class StudentModule {}
export class StudentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(StudentController);
  }
}

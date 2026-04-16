import { extname } from 'node:path'
import { BullModule } from '@nestjs/bullmq'
import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware'
import { TenantConnectionService } from 'src/providers/tenant.connection.service'
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider'
import { ModelProvider } from 'src/providers/tenant-models.provider'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'
import { ClassProcessor } from './class.worker'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'classImportQueue' }),

    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter(req, file, callback) {
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ]
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only Excel files are allowed'),
            false,
          )
        }
        callback(null, true)
      },
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './uploads')
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname)
          const filename = `${Date.now()}${ext}`
          callback(null, filename)
        },
      }),
    }),
  ],
  controllers: [ClassController],
  providers: [
    ClassService,
    ClassProcessor,
    TenantConnectionProvider,
    TenantConnectionService,
    ModelProvider.classModel,
  ],
  exports: [],
})
export class ClassModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ClassController)
  }
}

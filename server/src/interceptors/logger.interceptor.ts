// logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Interceptor')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const controllerName = context.getClass().name // ← controller name
    const handlerName = context.getHandler().name // ← method name

    this.logger.log(
      `${req.method} ${req.url} → ${controllerName}.${handlerName}()`,
    )

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${controllerName}.${handlerName}() completed`),
        ),
      )
  }
}

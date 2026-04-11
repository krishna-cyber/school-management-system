// src/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { logs, SeverityNumber, AnyValueMap } from '@opentelemetry/api-logs';

const otelLogger = logs.getLogger('school-management-api');

const logger = {
  info: (message: string, attributes?: Record<string, unknown>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
      attributes: attributes as AnyValueMap | undefined,
    });
  },
  error: (message: string, attributes?: Record<string, unknown>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: message,
      attributes: attributes as AnyValueMap | undefined,
    });
  },
  warn: (message: string, attributes?: Record<string, unknown>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: 'WARN',
      body: message,
      attributes: attributes as AnyValueMap | undefined,
    });
  },
  debug: (message: string, attributes?: Record<string, unknown>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.DEBUG,
      severityText: 'DEBUG',
      body: message,
      attributes: attributes as AnyValueMap | undefined,
    });
  },
  log: (message: string, attributes?: Record<string, unknown>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
      attributes: attributes as AnyValueMap | undefined,
    });
  },
};

@Injectable()
export class OtelLoggerService implements LoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }
  error(message: string, trace?: string, context?: string) {
    logger.error(message, { trace, context });
  }
  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }
}

export { logger };

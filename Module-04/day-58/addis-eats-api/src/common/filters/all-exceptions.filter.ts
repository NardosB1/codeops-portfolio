import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private translateError(exception: unknown): { status: number; message: string | string[] } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as { message: string | string[] }).message
          : exception.message;
      return { status, message };
    }

    // Any non-HTTP runtime exception (including forced TypeError) translates to a safe 500
    this.logger.error(
      'Unhandled internal exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const headerReqId = request.headers['x-request-id'];
    const requestId = Array.isArray(headerReqId)
      ? headerReqId[0]
      : headerReqId || uuidv4();
    const timestamp = new Date().toISOString();
    const path = request.url;

    const { status, message } = this.translateError(exception);

    // Exactly five fields on every error body, zero stack traces exposed
    response.status(status).json({
      statusCode: status,
      message,
      path,
      timestamp,
      requestId,
    });
  }
}

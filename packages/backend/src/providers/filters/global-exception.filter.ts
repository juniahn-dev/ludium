import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const buildErrorMessage = (
      status: HttpStatus,
      message?: string,
      error?: string,
    ) => {
      return {
        statusCode: status,
        message: message || (exception as any).message,
        error:
          error ||
          (exception as any).error ||
          (exception as any).response?.error,
        path: request.url,
        timestamp: new Date().toISOString(),
      };
    };

    const message = (() => {
      const statusCode = (() => {
        try {
          return exception.getStatus();
        } catch (err) {
          return HttpStatus.INTERNAL_SERVER_ERROR;
        }
      })();

      switch (exception.constructor) {
        // case BadRequestException: // for BadRequestException
        //   return buildErrorMessage(statusCode);

        default: // default
          return buildErrorMessage(statusCode);
      }
    })();

    response.status(message.statusCode).json(message);
  }
}

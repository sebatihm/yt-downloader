import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class UrlErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const response = exception.getResponse() as HttpException;
    const message = response.message?.[0] ?? response.message ?? 'Bad Request';
    return res.redirect('/?error=' + encodeURIComponent(message));
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class UrlErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const response = exception.getResponse() as HttpException;
    const message = response.message?.[0] ?? response.message ?? 'Bad Request';
    req.session['error'] = message;
    return res.redirect('/');
  }
}

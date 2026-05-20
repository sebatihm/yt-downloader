import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {};
  }

  @Post('/metadata')
  async downloadVideo(@Body('url') url: string) {
    return await this.appService.downloadYt(url);
  }
}

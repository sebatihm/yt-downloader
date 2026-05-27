import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DownloadResource } from './youtube-api/dtos/downloadResource.dto';
import type { Request, Response } from 'express';
import * as fs from 'node:fs';
import { YoutubeInfoValidation } from './youtube-api/validation/youtube-info.dto';
import { DownloadVideoQueryParams } from './youtube-api/validation/download-video.dto';
import { DownloadAudioQueryParams } from './youtube-api/validation/download.audio.dto';
import { UrlErrorFilter } from './filters/url-error/url-error.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(@Req() req: Request) {
    const error = (req.session['error'] as string) ?? null;
    delete req.session['error'];

    return {
      error,
    };
  }

  @Post('/info')
  @UseFilters(UrlErrorFilter)
  @Render('download-resource')
  async getMetadata(@Body() body: YoutubeInfoValidation) {
    const data = await this.appService.downloadYt(body.url);
    return { ...data, url: body.url };
  }

  @Get('/download-video')
  async downloadVideo(
    @Res() res: Response,
    @Query() body: DownloadVideoQueryParams,
  ) {
    const filename = decodeURIComponent(body.filename)
      .replace(/&#x3D;/g, '=')
      .replace(/&amp;/g, '&');

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Accel-Buffering', 'no');

    const info: DownloadResource = {
      id: body.id,
      audio: body.audio_id
        ? { id: body.audio_id, ext: undefined, bitrate: 0 }
        : null,
      original_url: body.original_url,
      quality: '',
      height: null,
      bitrate: 0,
      ext: null,
    };

    const fileStream = await this.appService.downloadVideo(info);

    await new Promise<void>((resolve, reject) => {
      fileStream.on('error', reject);
      res.on('finish', () => {
        fs.unlink(fileStream.path, () => {});
        resolve();
      });
      res.on('error', reject);
      fileStream.pipe(res);
    });
  }

  @Get('/download-audio')
  async audio(
    @Query() query: DownloadAudioQueryParams,
    @Res({ passthrough: true }) res: Response,
  ) {
    const stream = await this.appService.downloadAudio(query);
    const filename = decodeURIComponent(query.filename)
      .replace(/&#x3D;/g, '=')
      .replace(/&amp;/g, '&');

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    await new Promise<void>((resolve, reject) => {
      stream.on('error', reject);
      res.on('finish', () => {
        fs.unlink(stream.path, () => {});
        resolve();
      });
      res.on('error', reject);
      stream.pipe(res);
    });
  }
}

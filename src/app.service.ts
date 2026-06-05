import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { YoutubeApiService } from './youtube-api/youtube-api.service';
import { DownloadResource } from './youtube-api/dtos/downloadResource.dto';
import { DownloadAudioQueryParams } from './youtube-api/validation/download.audio.dto';

@Injectable()
export class AppService {
  constructor(private youtubeApi: YoutubeApiService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async downloadYt(url: string) {
    try {
      return await this.youtubeApi.getInfo(url);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error getting the metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  downloadVideo(info: DownloadResource) {
    try {
      return this.youtubeApi.downloadVideo(info);
    } catch (error) {
      throw new HttpException(
        'Error getting the metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async downloadAudio(query: DownloadAudioQueryParams) {
    try {
      return await this.youtubeApi.downloadAudio(query);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error getting the metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}

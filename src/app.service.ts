import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { YoutubeApiService } from './youtube-api/youtube-api.service';

@Injectable()
export class AppService {
  constructor(private youtubeApi: YoutubeApiService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async downloadYt(url: string) {
    try {
      // parse url
      return await this.youtubeApi.getInfo(url);
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

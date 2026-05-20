import { Module } from '@nestjs/common';
import { YoutubeApiService } from './youtube-api.service';
import { YoutubeApiController } from './youtube-api.controller';

@Module({
  controllers: [YoutubeApiController],
  providers: [YoutubeApiService],
  exports: [YoutubeApiService],
})
export class YoutubeApiModule {}

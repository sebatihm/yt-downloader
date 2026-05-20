import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeApiModule } from './youtube-api/youtube-api.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [YoutubeApiModule],
})
export class AppModule {}

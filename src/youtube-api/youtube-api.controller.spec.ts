import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeApiController } from './youtube-api.controller';
import { YoutubeApiService } from './youtube-api.service';

describe('YoutubeApiController', () => {
  let controller: YoutubeApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeApiController],
      providers: [YoutubeApiService],
    }).compile();

    controller = module.get<YoutubeApiController>(YoutubeApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

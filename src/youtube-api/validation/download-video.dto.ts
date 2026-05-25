import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DownloadVideoQueryParams {
  @Type(() => Number)
  @IsNumber({})
  @IsNotEmpty()
  id: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  audio_id: number;

  @IsString()
  @IsNotEmpty()
  original_url: string;

  @IsString()
  @IsNotEmpty()
  filename: string;
}

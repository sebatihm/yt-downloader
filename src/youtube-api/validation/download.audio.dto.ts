import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DownloadAudioQueryParams {
  @Type(() => Number)
  @IsNumber({})
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  original_url: string;

  @IsString()
  @IsNotEmpty()
  filename: string;
}
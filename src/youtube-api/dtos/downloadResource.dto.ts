import { AudioFormat } from './audioFormat.dto';

export class DownloadResource {
  id: number;
  quality: string;
  height: number | null;
  bitrate: number;
  ext: string | null;
  audio: AudioFormat | null;
  original_url: string;
}

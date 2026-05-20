import { AudioFormat } from './audioFormat.dto';

export interface VideoFormat {
  id: number;
  quality: string;
  height: number | null;
  bitrate: number;
  ext: string | null;
  audio: AudioFormat | null;
}

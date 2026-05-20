import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { YtDlp } from 'ytdlp-nodejs';
import { AudioFormat } from './dtos/audioFormat.dto';
import { YtDlpFormat } from './dtos/ytlDlpFormat.dto';
import { VideoFormat } from './dtos/videoFormat.dto';

@Injectable()
export class YoutubeApiService {
  async getInfo(url: string) {
    try {
      const ytdlp = new YtDlp();
      const info = await ytdlp.getInfoAsync(url);

      if (info._type !== 'video') {
        console.log('No es un video');
        return;
      }
      const formats = info.formats as YtDlpFormat[];
      const audioFormats: AudioFormat[] = formats
        .filter((f) => {
          return f.ext === 'm4a' && f.vcodec === 'none' && f.acodec !== 'none';
        })
        .map((f: YtDlpFormat) => ({
          id: +f.format_id,
          ext: f.ext,
          bitrate: f.abr ?? 0,
        }))
        .sort((a, b) => b.bitrate - a.bitrate);

      const uniqueVideos: VideoFormat[] = Object.values(
        formats
          .filter((f) => f.ext === 'mp4' && f.height && f.vcodec !== 'none')
          .reduce((acc: Record<number, VideoFormat>, f: YtDlpFormat) => {
            const height: number = f.height!;

            const current: VideoFormat = acc[height];

            if (!current || (f.tbr ?? 0) > current.bitrate) {
              acc[height] = {
                id: +f.format_id,
                quality: `${f.height}p`,
                height: f.height ?? null,
                bitrate: f.tbr ?? 0,
                ext: f.ext ?? null,
                audio: audioFormats.length !== 0 ? audioFormats[0] : null,
              };
            }

            return acc;
          }, {}) as VideoFormat[],
      );

      return {
        audio_formats: audioFormats,
        bestAudioFormat: audioFormats[0],
        video_qualities: uniqueVideos,
      };
    } catch (error) {
      throw new HttpException(
        'Error fetching the internal data',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}

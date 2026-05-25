import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { YtDlp } from 'ytdlp-nodejs';
import { AudioFormat } from './dtos/audioFormat.dto';
import { YtDlpFormat } from './dtos/ytlDlpFormat.dto';
import { VideoFormat } from './dtos/videoFormat.dto';
import { DownloadResource } from './dtos/downloadResource.dto';
import * as fs from 'node:fs';
import path from 'node:path';
import * as os from 'os';
import { DownloadAudioQueryParams } from './validation/download.audio.dto';

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
        original_url: url,
        audio_formats: audioFormats,
        best_audio_format: audioFormats[0],
        video_qualities: uniqueVideos,
        video_data: {
          thumbnail_url: info.thumbnail,
          title: info.title,
          channel: info.channel,
          duration: info.duration_string,
        },
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

  async downloadVideo(info: DownloadResource) {
    try {
      const format = info.audio?.id
        ? `${info.id}+${info.audio.id}`
        : `${info.id}`;

      const url = decodeURIComponent(info.original_url)
        .replace(/&#x3D;/g, '=')
        .replace(/&amp;/g, '&');

      const tmpFile = path.join(os.tmpdir(), `video_${Date.now()}.mp4`);

      const ytdlp = new YtDlp();

      await ytdlp
        .download(url)
        .addArgs('-f', format, '--merge-output-format', 'mp4', '-o', tmpFile)
        .run();

      return fs.createReadStream(tmpFile);
    } catch (error) {
      throw new HttpException(
        'Error creating the download',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async downloadAudio(info: DownloadAudioQueryParams) {
    try {
      const url_sanitized = decodeURIComponent(info.original_url)
        .replace(/&#x3D;/g, '=')
        .replace(/&amp;/g, '&');

      const tmpFile = path.join(os.tmpdir(), `audio_${Date.now()}.mp3`);

      const ytdlp = new YtDlp();

      await ytdlp
        .download(url_sanitized)
        .addArgs(
          '-f',
          `${info.id}`,
          '-x',
          '--audio-format',
          'mp3',
          '--audio-quality',
          '0',
          '-o',
          tmpFile,
        )
        .run();

      return fs.createReadStream(tmpFile);
    } catch (error) {
      throw new HttpException(
        'Error creating the audio download',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}

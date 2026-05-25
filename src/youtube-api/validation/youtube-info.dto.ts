import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class YoutubeInfoValidation {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      return value;
    }

    // Transform  normal links
    const watchId = parsed.searchParams.get('v');
    if (watchId) {
      return `https://www.youtube.com/watch?v=${watchId}`;
    }

    // Support youtube shorts
    const shortsMatch = parsed.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})/);
    if (shortsMatch) {
      return `https://www.youtube.com/shorts/${shortsMatch[1]}`;
    }

    return value;
  })
  @Matches(
    /^https:\/\/www\.youtube\.com\/(?:watch\?v=|shorts\/)[A-Za-z0-9_-]{11}$/,
    {
      message: 'Invalid YouTube URL',
    },
  )
  url: string;
}

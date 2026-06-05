import { helpers, YtDlp } from 'ytdlp-nodejs';
async function setup() {
  const ytdlp = new YtDlp();

  console.log('Downloading yt-dlp...');
  await helpers.downloadYtDlp();

  console.log('Downloading FFmpeg...');
  await ytdlp.downloadFFmpeg();

  console.log('Setup completed');
}

setup().catch((error) => {
  console.error(error);
  process.exit(1);
});

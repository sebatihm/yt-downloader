import { YtDlp } from 'ytdlp-nodejs';
async function setup() {
  const ytdlp = new YtDlp();
  await ytdlp.downloadFFmpeg();

  console.log('Setup completed');
}

setup().catch((error) => {
  console.error(error);
  process.exit(1);
});

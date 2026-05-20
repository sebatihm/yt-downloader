export interface YtDlpFormat {
  format_id: string;
  ext?: string;
  vcodec?: string;
  acodec?: string;
  abr?: number;
  height?: number;
  fps?: number;
  tbr?: number;
}

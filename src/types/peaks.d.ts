export interface AudioPeaks {
  sampleRate: number;
  samplesPerPixel: number;
  bits: number;
  length: number;
  peaks: number[][];
  channels: number;
}

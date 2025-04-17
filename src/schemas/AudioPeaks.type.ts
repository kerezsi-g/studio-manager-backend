import { Type as T, Static } from "utils/typebox-openapi";

const $id = "AudioPeaks";

export const AudioPeaks = T.Object(
  {
    sampleRate: T.Integer(),
    samplesPerPixel: T.Integer(),
    length: T.Integer(),
    bits: T.Integer(),
    peaks: T.Array(T.Array(T.Number())),
    channels: T.Integer(),
  },
  { $id }
);

export type AudioPeaks = Static<typeof AudioPeaks>;

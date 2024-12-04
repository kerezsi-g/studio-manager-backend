import { readFile } from "node:fs/promises";
import { api, Query } from "encore.dev/api";

import { generatePeaks } from "../utils/generatePeaks";
import { AudioPeaks } from "../../types";
import { getFilePath } from "./getFilePath";

interface GetAudioPeaksRequest {
  fileId: string;
  bits?: Query<8 | 16 | 24>;
  chunkSize?: Query<512 | 1024 | 2048 | 4096 | 8192>;
}

interface GetAudioPeakResponse {
  data: AudioPeaks;
}

export const getAudioPeaks = api<GetAudioPeaksRequest, GetAudioPeakResponse>(
  {
    method: "GET",
    path: "/files/:fileId/metadata",
    expose: true,
    auth: true,
  },
  async ({ fileId, bits = 8, chunkSize = 4096 }) => {
    const { path } = await getFilePath({ fileId });

    const file = await readFile(path);

    const results = await generatePeaks(file, { bits, chunkSize });

    return { data: results };
  }
);

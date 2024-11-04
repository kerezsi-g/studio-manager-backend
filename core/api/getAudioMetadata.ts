import { readFile } from "node:fs/promises";
import { api, Query } from "encore.dev/api";

import { getFilePath } from "../utils/getFilePath";
import { generatePeaks } from "../utils/generatePeaks";
import { AudioPeaks } from "../types";

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
    // auth: true,
  },
  async ({ fileId, bits = 8, chunkSize = 4096 }) => {
    const filePath = await getFilePath(fileId);

    const file = await readFile(filePath);

    const results = await generatePeaks(file, { bits, chunkSize });

    return { data: results };
  }
);

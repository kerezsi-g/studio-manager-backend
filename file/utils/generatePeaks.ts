import { spawn } from "child_process";
import { AudioPeaks } from "../../types";
// import { Peaks } from "../schemas/Peaks.schema";

interface AUDIOWAVEFORM_OUTPUT {
  version: number;
  sample_rate: number;
  samples_per_pixel: number;
  bits: number;
  length: number;
  data: number[];
  channels: number;
}

interface GenPeaksParams {
  bits?: number;
  chunkSize?: number;
}

export async function generatePeaks(
  audioBuffer: Buffer,
  { bits = 8, chunkSize = 4096 }: GenPeaksParams
): Promise<AudioPeaks> {
  const audiowaveformArgs = [
    // Nested array format purely for readability
    ["--input-format", "wav"], // Assuming WAV input
    ["--output-format", "json"],
    "--split-channels", // Generate peaks for each individual channel
    ["--bits", bits.toString()],
    ["-z", chunkSize.toString()],
  ].flat();

  const audiowaveform = spawn("lib/audiowaveform", audiowaveformArgs);

  audiowaveform.stderr.on("data", (data) => {
    console.error(`audiowaveform error: ${data}`);
  });

  // Pipe the audio buffer to audiowaveform's stdin
  audiowaveform.stdin.write(audioBuffer);
  audiowaveform.stdin.end();

  let jsonOutput = "";

  // Collect JSON output from stdout
  for await (const chunk of audiowaveform.stdout) {
    jsonOutput += chunk;
  }

  // Error handling: Throw if audiowaveform exits with a non-zero code
  const exitCode = await new Promise<number>((resolve, reject) => {
    audiowaveform.on("close", resolve);
    audiowaveform.on("error", reject);
  });

  if (exitCode) {
    throw new Error(`audiowaveform exited with code ${exitCode}`);
  }

  try {
    const { sample_rate, samples_per_pixel, bits, length, data, channels } =
      JSON.parse(jsonOutput) as AUDIOWAVEFORM_OUTPUT;

    return {
      sampleRate: sample_rate,
      samplesPerPixel: samples_per_pixel,
      length,
      bits,
      peaks: deinterleave(data, channels),
      channels,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to parse audiowaveform output: ${error}`);
  }
}

function deinterleave(data: number[], channels: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < channels; i++) {
    result[i] = [];
  }

  for (let i = 0; i < data.length; i += channels * 2) {
    for (let ch = 0; ch < channels; ch++) {
      result[ch].push(data[i + ch * 2]); // minPeak
      result[ch].push(data[i + ch * 2 + 1]); // maxPeak
    }
  }

  return result;
}

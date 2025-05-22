import config from "config";

const { bits, samplesPerPeak } = config.audioPeaks;

const LIB_PATH = config.libs.audiowaveform;

interface AUDIOWAVEFORM_OUTPUT {
  version: number;
  sample_rate: number;
  samples_per_pixel: number;
  bits: number;
  length: number;
  data: number[];
  channels: number;
}

export async function extractPeaks(file: Bun.BunFile): Promise<Bun.BunFile> {
  const outputFile = Bun.file(file.name + "_peaks.json");

  const audiowaveformArgs = [
    // Nested array format purely for readability
    ["--input-format", "wav"], // Assuming WAV input
    ["--output-format", "json"],
    "--split-channels", // Generate peaks for each individual channel
    ["--bits", bits.toString()],
    ["--zoom", samplesPerPeak.toString()],
  ].flat();

  const childProcess = Bun.spawn([LIB_PATH, ...audiowaveformArgs], {
    stdin: file,
  });

  const jsonOutput = await new Response(childProcess.stdout).json();

  try {
    const { sample_rate, samples_per_pixel, bits, length, data, channels } =
      jsonOutput as AUDIOWAVEFORM_OUTPUT;

    const deinterleaved = {
      sampleRate: sample_rate,
      samplesPerPixel: samples_per_pixel,
      length,
      bits,
      peaks: deinterleave(data, channels),
      channels,
    };

    await outputFile.write(JSON.stringify(deinterleaved));

    return outputFile;
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

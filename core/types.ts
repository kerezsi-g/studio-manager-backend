export interface Project {
  projectId: string;
  projectName: string;
  created: Date;
}

type MEDIA_TYPE = "audio";

export interface Asset {
  assetId: string;
  assetName: string;
  created: Date;
  mediaType: MEDIA_TYPE;
  fileCount: number;
  lastModified: Date | null;
}

export interface MediaFile {
  fileId: string;
  assetId: string;
  created: Date;
  remark?: string;
}

export interface Annotation {
  annotationId: string;
  assetId: string;
  t: number;
  createdFor: string;
  resolvedAt: string | null;
  createdAt: Date;
}

export interface MediaFormat {
  format: string;
  mediaType: MEDIA_TYPE;
  name: string;
}
export interface AudioPeaks {
  sampleRate: number;
  samplesPerPixel: number;
  bits: number;
  length: number;
  peaks: number[][];
  channels: number;
}

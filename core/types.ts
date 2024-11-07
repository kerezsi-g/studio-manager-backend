export interface Collection {
  collectionId: string;
  collectionName: string;
  created: Date;
  projectCount: number
}

type MEDIA_TYPE = "audio";

export interface Project {
  projectId: string;
  projectName: string;
  created: Date;
  mediaType: MEDIA_TYPE;
  fileCount: number;
  lastModified: Date | null;
}

export interface MediaFile {
  fileId: string;
  projectId: string;
  created: Date;
  remark?: string;
}

export interface Review {
  reviewId: string;
  projectId: string;
  content: string;
  t: number;
  fileId: string;
  resolvedBy: string | null;
  created: Date;
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

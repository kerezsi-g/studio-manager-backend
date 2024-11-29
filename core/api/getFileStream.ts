import { api } from "encore.dev/api";
import { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import { getAuthData } from "~encore/auth";
import { getFilePath } from "./getFilePath";

interface GetFileRequest {
  fileId: string;
}

// interface GetFileResponse {
//   collectionId: string;
//   data: Project[];
// }

export const getFileStream = api.raw(
  {
    method: "GET",
    path: "/media/:fileId",
    expose: true,
    auth: false,
  },
  async (request, response) => {
    const requestUrl = request.url!;

    const parsedUrl = new URL(requestUrl, `http://${request.headers.host}`);
    const pathname = parsedUrl.pathname; // e.g., '/files/12345'
    const pathSegments = pathname.split("/");

    const fileId = pathSegments[pathSegments.length - 1]; // Assuming the fileId is the last segment

    const { path } = await getFilePath({ fileId });

    handleRangeRequest(path, request, response);
  }
);

interface Range {
  start: number;
  end: number;
}

function handleRangeRequest(
  filePath: string,
  request: IncomingMessage,
  response: ServerResponse
) {
  const fileSize = fs.statSync(filePath).size;
  const rangeHeader = request.headers["range"];
  const range = parseRangeHeader(rangeHeader, fileSize);
  const { start, end } = range || { start: 0, end: fileSize - 1 };

  const stream = fs.createReadStream(filePath, { start, end });

  response.writeHead(range !== null ? 206 : 200, {
    "Content-Type": "audio/mpeg",
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Content-Length": end - start + 1,
    "Accept-Ranges": "bytes",
  });

  stream.pipe(response);

  stream.on("error", (err: Error) => {
    console.error("Error streaming audio:", err);
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("Internal Server Error");
  });
}

function parseRangeHeader(
  rangeHeader: string | undefined,
  fileSize: number
): Range | null {
  if (!rangeHeader) {
    return null;
  }

  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  return {
    start,
    end,
  };
}

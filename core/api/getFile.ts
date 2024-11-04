import { api } from "encore.dev/api";
import { Asset } from "../types";
import { database } from "../db";

import path from "node:path";
import { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import { getFilePath } from "../utils/getFilePath";
import { handleRangeRequest } from "../utils/handleRangeRequest";

interface GetFileRequest {
  fileId: string;
}

// interface GetFileResponse {
//   projectId: string;
//   data: Asset[];
// }

export const getFile = api.raw(
  {
    method: "GET",
    path: "/files/:fileId",
    expose: true,
    // auth: true,
  },
  async (request, response) => {
    const requestUrl = request.url!;

    const parsedUrl = new URL(requestUrl, `http://${request.headers.host}`);
    const pathname = parsedUrl.pathname; // e.g., '/files/12345'
    const pathSegments = pathname.split("/");

    const fileId = pathSegments[pathSegments.length - 1]; // Assuming the fileId is the last segment

    const pathToFile = await getFilePath(fileId);

    handleRangeRequest(pathToFile, request, response);
  }
);

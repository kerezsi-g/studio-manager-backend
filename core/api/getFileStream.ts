import { api } from "encore.dev/api";
import { getFilePath } from "../utils/getFilePath";
import { handleRangeRequest } from "../utils/handleRangeRequest";

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

import { readFile } from "node:fs/promises";
import { api, Query } from "encore.dev/api";

import { generatePeaks } from "../utils/generatePeaks";
import { AudioPeaks } from "../../types";
import { database } from "../../admin/db";
import { getAuthData } from "~encore/auth";
import { createAccessToken } from "../utils/fileAccessTokenStore";
import { getFilePath } from "./getFilePath";

interface GetFileAccessTokenRequest {
  fileId: string;
}

interface GetFileAccessTokenResponse {
  token: string;
}

export const getFileAccessToken = api<
  GetFileAccessTokenRequest,
  GetFileAccessTokenResponse
>(
  {
    method: "GET",
    path: "/files/:fileId/token",
    expose: true,
    auth: true,
  },
  async ({ fileId }) => {
    const auth = getAuthData()!;

    const { path } = await getFilePath({ fileId });

    const token = createAccessToken(path);

    return { token };
  }
);

const SqlQuery = /*sql*/ `
	select 		distinct
				path				as "path"
	from		v_user_projects
	join		t_files				using (project_id)
	where		file_id = $<fileId>	
	and			user_id = $<userID>
`;

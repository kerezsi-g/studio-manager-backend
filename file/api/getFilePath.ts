import { readFile } from "node:fs/promises";
import { api, Query } from "encore.dev/api";

import { generatePeaks } from "../utils/generatePeaks";
import { AudioPeaks } from "../../types";
import { database } from "../../admin/db";
import { getAuthData } from "~encore/auth";

interface GetFilePathRequest {
  fileId: string;
}

interface GetFilePathResponse {
  path: string;
}

export const getFilePath = api<GetFilePathRequest, GetFilePathResponse>(
  {
    method: "GET",
    path: "/files/:fileId/path",
    expose: false,
    auth: true,
  },
  async ({ fileId }) => {
    const auth = getAuthData();

    const { path } = await database.one<{ path: string }>(SqlQuery, {
      fileId,
      userID: auth?.userID ?? null,
    });

    return { path };
  }
);

const SqlQuery = /*sql*/ `
	select distinct
				path				as "path"
	from		v_user_projects
	join		t_files				using (project_id)
	where		file_id = $<fileId>	
	and			($<userID> is null or user_id = $<userID>)
`;

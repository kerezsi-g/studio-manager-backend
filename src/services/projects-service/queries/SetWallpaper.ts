import { db } from "db";

type QueryParams = {
  projectId: string;
  sha256: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_projects
	SET
		wallpaper = @sha256
	WHERE
		project_id = @projectId	
`);

export function SetWallpaper({ projectId, sha256 }: QueryParams) {
  return sql.run({ projectId, sha256 });
}

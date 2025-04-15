import { db } from "db";

type QueryParams = {
  projectId: string;
  sha256: string;
  tag: string;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	DELETE FROM
		t_project_files
	WHERE
		project_id = @projectId
	AND
		sha256 = @sha256
	AND
		tag = @tag
`);

interface Args {
  projectId: string;
  sha256: string;
  tag: string;
}

export function UnlinkFileFromProject({ projectId, sha256, tag }: Args) {
  const bindParams: QueryParams = {
    projectId,
    sha256,
    tag,
  };

  sql.run(bindParams);
}

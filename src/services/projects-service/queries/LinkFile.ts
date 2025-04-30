import { db } from "db";

type ProjectFileAssociation = {
  projectId: string;
  sha256: string;
  tag: string;
  path?: string;
  fileName?: string;
};

type QueryParams = ProjectFileAssociation & {
  addedAt: number;
};

const sql = db.query<ProjectFileAssociation, QueryParams>(/*sql*/ `
	INSERT INTO
		t_project_files (project_id, sha256, tag, path, file_name, added_at)
	VALUES
		(@projectId, @sha256, @tag, @path, @fileName, @addedAt)
	RETURNING
		project_id		AS "projectId",
		sha256			AS "sha256",
		tag				AS "tag",
		path			AS "path",
		file_name		AS "fileName"
`);

/** @deprecated */
export function LinkFileToProject({
  projectId,
  sha256,
  tag,
  path,
  fileName,
}: ProjectFileAssociation) {
  const bindParams: QueryParams = {
    projectId,
    sha256,
    tag,
    fileName,
    path,
    addedAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}

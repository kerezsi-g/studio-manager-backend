import { db } from "db";

type QueryParams = {
  projectId: string;
  tag: string | null;
};

type QueryResult = {
  sha256: string;
  path: string;
  fileName: string;
  contentType: string;
  size: number;
  tag: string;
  addedAt: number;
  uploadedAt: number;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT					
		F.sha256				AS "sha256"
	,	F.content_type			AS "contentType"
	,	COALESCE(
			PF.file_name,
			F.file_name )		AS "fileName"
	,	F.size					AS "size"
	,	PF.path					AS "path"
	,	PF.tag					AS "tag"
	,	PF.added_at				AS "addedAt"
	,	F.uploaded_at			AS "uploadedAt"
	,	F.created_at			AS "createdAt"
	FROM
		t_project_files PF
	JOIN
		t_files	F ON PF.sha256 = F.sha256
	WHERE
		PF.project_id = @projectId
	AND
		( @tag is NULL or PF.tag = @tag )
	ORDER BY
		F.created_at DESC
`);

export function GetProjectFiles(projectId: string, tag: string | null = null) {
  const bindParams: QueryParams = {
    projectId,
    tag,
  };

  const result = sql.all(bindParams);

  return result;
}

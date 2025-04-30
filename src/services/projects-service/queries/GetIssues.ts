import { db } from "db";

type QueryParams = {
  projectId: string;
};

type QueryResult = {
  issueId: string;
  projectId: string;
  assetId: string;
  userId: string;
  description: string;
  timestamp: number;
  duration: number;
  resolvedAt: number;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		issue_id		AS "issueId"
	,	project_id		AS "projectId"
	,	asset_id		AS "assetId"
	,	user_id			AS "userId"
	,	description		AS "description"
	,	timestamp		AS "timestamp"
	,	duration		AS "duration"
	,	resolved_at		AS "resolvedAt"
	,	created_at		AS "createdAt"
	FROM
		t_issues	
	WHERE
		project_id = @projectId
	ORDER BY
		created_at DESC
`);

export function GetProjectIssues(projectId: string) {
  const bindParams: QueryParams = {
    projectId,
  };

  const result = sql.all(bindParams);

  return result;
}

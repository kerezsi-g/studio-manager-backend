import { generateUuid } from "utils/generateUuid";
import { db } from "../db";

type QueryParams = {
  userId: string;
  issueId: string;
  projectId: string;
  resolvedAt: number;
};

type QueryResult = {
  // Empty
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_issues
	SET
		resolved_at = @resolvedAt
	WHERE
		issue_id = @issueId
	AND
		project_id = @projectId
	AND
		user_id = @userId
`);

interface Args {
  userId: string;
  projectId: string;
  issueId: string;
}

export function ResolveIssue({ userId, projectId, issueId }: Args) {
  const bindParams: QueryParams = {
    issueId,
    userId,
    projectId,
    resolvedAt: Date.now(),
  };

  const result = sql.get(bindParams);

  return result;
}

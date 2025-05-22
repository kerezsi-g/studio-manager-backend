import { db } from "db";

type QueryParams = {
  userId: string;
  issueId: string;
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
		user_id = @userId
`);

interface Args {
  userId: string;
  issueId: string;
}

export function ResolveIssue({ userId, issueId }: Args) {
  const bindParams: QueryParams = {
    issueId,
    userId,
    resolvedAt: Date.now(),
  };

  const result = sql.run(bindParams);

  return result;
}

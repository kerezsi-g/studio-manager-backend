import { generateUuid } from "utils/generateUuid";
import { db } from "../db";

type QueryParams = {
  projectId: string;
  issueId: string;
  userId: string;
  description: string;
  timestamp: number | null;
  duration: number | null;
  createdAt: number;
};

type QueryResult = {
  issueId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_issues (issue_id, project_id, user_id, description, timestamp, duration, created_at)
	VALUES
		(@issueId, @projectId, @userId, @description, @timestamp, @duration, @createdAt)
	RETURNING
		issue_id as "issueId"
`);

interface Args {
  projectId: string;
  userId: string;
  description: string;
  timestamp: number | null;
  duration: number | null;
}

export function CreateIssue({ projectId, userId, description, timestamp, duration }: Args) {
  if (duration !== null && timestamp === null) {
    throw new Error("Timestamp cannot be null if a duration is provided");
  }

  const bindParams: QueryParams = {
    issueId: generateUuid(),
    projectId,
    userId,
    description,
    timestamp,
    duration,
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  if (result) {
    return result.issueId;
  } else {
    throw new Error("Failed to create issue");
  }
}

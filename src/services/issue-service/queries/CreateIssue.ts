import { generateUuidV4 } from "utils/generateUuid";
import { db } from "db";

type QueryParams = {
  projectId: string;
  assetId: string;
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
		t_issues (issue_id, project_id, asset_id, user_id, description, timestamp, duration, created_at)
	VALUES
		(@issueId, @projectId, @assetId, @userId, @description, @timestamp, @duration, @createdAt)
	RETURNING
		issue_id as "issueId"
`);

interface Args {
  userId: string;
  projectId: string;
  assetId: string;
  description: string;
  timestamp: number | null;
  duration: number | null;
}

export function CreateIssue({
  userId,
  projectId,
  assetId,
  description,
  timestamp,
  duration,
}: Args) {
  if (duration !== null && timestamp === null) {
    throw new Error("Timestamp cannot be null if a duration is provided");
  }

  const bindParams: QueryParams = {
    issueId: generateUuidV4(),
    projectId,
    assetId,
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

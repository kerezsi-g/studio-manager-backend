import { db } from "../db";

type QueryParams = {
  userId: string;
};

type QueryResult = {
  collectionId: string;
  collectionName: string;
  createdAt: number;
  projectCount: number;
  lastModified: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT
		UC.collection_id	AS "collectionId"
	,	UC.collection_name	AS "collectionName"
	,	UC.created_at		AS "createdAt"
	,	UC.project_count	AS "projectCount"
	,	UC.last_modified	AS "lastModified" -- TODO: Implement better tracking of last modification
	FROM
		v_user_collections UC
	WHERE
		UC.user_id = @userId
	ORDER BY
		UC.created_at DESC
`);

type Args = {
  userId: string;
};

export function GetUserCollections({ userId }: Args) {
  const bindParams: QueryParams = {
    userId,
  };

  const result = sql.all(bindParams);

  return result;
}

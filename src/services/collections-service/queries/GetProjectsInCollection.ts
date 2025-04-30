import { db } from "db";

type QueryParams = {
  userId: string;
  collectionId: string;
};

type QueryResult = {
  projectId: string;
  projectName: string;
  projectType: string;
  createdAt: number;
  subject: string;
  thumbnail: string | null;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT 
		project_id		AS "projectId"
	,	project_name	AS "projectName"
	,	project_type	AS "projectType"
	,	created_at		AS "createdAt"
	,	subject			AS "subject"
	,	thumbnail		AS "thumbnail"
	FROM
		v_user_collection_projects
	WHERE
		user_id = @userId
	AND
		collection_id = @collectionId
`);

type Args = {
  userId: string;
  collectionId: string;
};

export function GetProjectsInCollection({ userId, collectionId }: Args) {
  const bindParams: QueryParams = {
    userId,
    collectionId,
  };

  const result = sql.all(bindParams);

  return result;
}

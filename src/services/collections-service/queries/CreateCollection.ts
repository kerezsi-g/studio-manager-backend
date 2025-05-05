import { generateUuid } from "utils/generate-uuid";
import { db } from "db";

type QueryParams = {
  collectionId: string;
  collectionName: string;
  createdAt: number;
};

type QueryResult = {
  collectionId: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_collections (collection_id, collection_name, created_at)
	VALUES
		(@collectionId, @collectionName, @createdAt)
	RETURNING
		collection_id AS "collectionId"
`);

interface Args {
  collectionName: string;
}

export function CreateCollection({ collectionName }: Args) {
  const bindParams: QueryParams = {
    collectionName,
    collectionId: generateUuid(),
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  if (result) {
    return result.collectionId;
  } else {
    throw new Error("Failed to create collection");
  }
}

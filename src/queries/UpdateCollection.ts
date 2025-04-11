import { db } from "db";

type QueryParams = {
  collectionId: string;
  collectionName: string;
};

type QueryResult = {
  collectionId: string;
  collectionName: string;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_collections
	SET
		collection_name = @collectionName
	WHERE
		collection_id = @collectionId
	RETURNING
		collection_id 	AS "collectionId",
		collection_name AS "collectionName"
`);

interface Args {
  collectionId: string;
  collectionName: string;
}

export function UpdateCollection({ collectionId, collectionName }: Args) {
  const bindParams: QueryParams = {
    collectionId,
    collectionName,
  };

  const result = sql.get(bindParams);

  if (result) {
    return result;
  } else {
    throw new Error("Failed to rename collection");
  }
}

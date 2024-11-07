import { api } from "encore.dev/api";
import { database } from "../db";
import { Collection } from "../types";

interface CreateCollectionRequest {
  collectionName: string;
}

interface CreateCollectionResponse {
  data: Collection;
}

export const createCollection = api<CreateCollectionRequest, CreateCollectionResponse>(
  {
    method: "POST",
    path: "/collections",
    expose: true,
    // auth: true,
  },
  async ({ collectionName }) => {
    const result = await database.one<Collection>(SqlQuery, { collectionName });

    return {
      data: result,
    };
  }
);

const SqlQuery = /*sql*/ `
	insert into t_collections(collection_name)
	values ($<collectionName>)
	returning	collection_id		as	"collectionId"
	,			collection_name		as	"collectionName"
	,			created				as	"created"
`;

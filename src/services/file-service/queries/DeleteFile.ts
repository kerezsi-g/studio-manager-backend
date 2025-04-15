import { db } from "db";

type QueryParams = {
  sha256: string;
};

type QueryResult = {};

// const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
// 	-- TODO
// `);

type Args = {
  sha256: string;
};

export function DeleteFile({ sha256 }: Args) {
  throw new Error("Not implemented");
}

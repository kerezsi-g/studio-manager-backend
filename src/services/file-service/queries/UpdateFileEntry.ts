import { db } from "db";

type QueryParams = {
  sha256: string;
  size: number;
};

type QueryResult = {};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	UPDATE
		t_files
	SET
		size = @size
	WHERE
		sha256 = @sha256
`);

type Args = {
  sha256: string;
  size: number;
};

export function UpdateFileEntry({ sha256, size }: Args) {
  const bindParams: QueryParams = {
    sha256,
    size,
  };

  sql.run(bindParams);

  return;
}

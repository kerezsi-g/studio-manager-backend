import { database } from "../db";

export async function getFilePath(fileId: string) {
  const { path } = await database.one<{ path: string }>(SqlQuery, { fileId });

  return path;
}

const SqlQuery = /*sql*/ `
	select		"path"
	from		t_files	f
	where		f.file_id = $<fileId>
`;

/**
 * source: https://encore.dev/docs/ts/how-to/file-uploads
 */

import { api } from "encore.dev/api";
import log from "encore.dev/log";
import busboy from "busboy";
import { database } from "../db";

type FileEntry = { data: any[]; filename: string };

export const uploadMedia = api.raw(
  {
    expose: true,
    method: "POST",
    path: "/projects/:projectId/media",
    bodyLimit: null,
    auth: true,
  },
  async (req, res) => {
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });
    const entry: FileEntry = { filename: "", data: [] };

    bb.on("file", (_, file, info) => {
      entry.filename = info.filename;
      file
        .on("data", (data) => {
          entry.data.push(data);
        })
        .on("close", () => {
          log.info(`File ${entry.filename} uploaded`);
        })
        .on("error", (err) => {
          bb.emit("error", err);
        });
    });

    bb.on("close", async () => {
      try {
        const buf = Buffer.concat(entry.data);

        await database.one(SqlQuery, { buf });

        log.info(`File ${entry.filename} saved`);

        // Redirect to the root page
        res.writeHead(303, { Connection: "close", Location: "/" });
        res.end();
      } catch (err) {
        bb.emit("error", err);
      }
    });

    bb.on("error", async (err) => {
      res.writeHead(500, { Connection: "close" });
      res.end(`Error: ${(err as Error).message}`);
    });

    req.pipe(bb);
    return;
  }
);

const SqlQuery = /*sql*/ `
	insert into t_media_files(project_uuid, data)
	values ($<project_uuid>, $<buf>)
	returning
		project_uuid as projectId,
		created
`;

import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FileService } from "services/file-service";

import { authenticate } from "server/hooks/auth";
import { AudioPeaks } from "schemas/AudioPeaks.type";

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(AudioPeaks);

  instance.put("/files", {
    schema: {
      hide: true,
    },
    handler: async (request, reply) => {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ msg: "File not found" });
      }

      const { file, filename } = data;

      const result = await FileService.handleReceiveFile(file, filename);

      return reply.status(200).send(result);
    },
  });

  instance.get("/files/:fileId", {
    schema: {
      hide: true,
      operationId: "getResource",
      tags: ["Files"],
      querystring: T.Object({
        download: T.Optional(T.Boolean()),
      }),
      params: T.Object({
        fileId: T.String(),
      }),
    },
    handler: async (request, reply) => {
      const { fileId } = request.params;
      const { download } = request.query;

      /**
       * ! Temporary solution until Bun supports presigning with custom headers
       *
       * @see https://github.com/oven-sh/bun/issues/17943
       * @see https://github.com/nikeee/lean-s3/issues/5
       */
      if (download) {
        const stream = await FileService.getReadStream(fileId);

        const fileMeta = await FileService.getFileById(fileId);

        reply.type(fileMeta.contentType);

        reply.header("content-disposition", `attachment; filename="${fileMeta.fileName}"`);
        reply.send(stream);

        return reply;
      }

      const url = await FileService.getDownloadUrl(fileId);

      reply.redirect(url, 302);

      return reply;
    },
  });

  instance.get("/files/:fileId/:suffix", {
    schema: {
      hide: true,
      params: T.Object({
        fileId: T.String(),
        suffix: T.String(),
      }),
    },
    handler: async (request, reply) => {
      const { fileId, suffix } = request.params;

      const url = await FileService.getDownloadUrl(fileId, suffix);

      reply.redirect(url, 302);

      return reply;
    },
  });

  instance.delete("/files/:fileId", {
    config: {
      adminOnly: true,
    },
    schema: {
      operationId: "markForDeletion",
      tags: ["Files"],
      params: T.Object({
        fileId: T.String(),
      }),
      response: {
        200: T.Object({
          msg: T.String(),
        }),
      },
    },
    handler: (request, reply) => {
      throw new Error("Not implemented");
    },
  });
};

export default plugin;

import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FileService } from "services/file-service";

import { authenticate } from "server/hooks/auth";
import { AudioPeaks } from "schemas/AudioPeaks.type";

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(AudioPeaks);

  instance.get("/files/:sha256", {
    schema: {
      operationId: "getResource",
      tags: ["Files"],
      querystring: T.Object({
        preview: T.Optional(T.Boolean()),
        noRedirect: T.Optional(T.Boolean()),
      }),
      params: T.Object({
        sha256: T.String(),
      }),
      response: {
        200: T.Object({
          url: T.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { sha256 } = request.params;
      const { preview, noRedirect } = request.query;

      const url = await FileService.getDownloadUrl(request.user.id, sha256, preview);

      if (noRedirect) {
        reply.status(200).send({ url });
      } else {
        reply.redirect(url, 302);
      }

      return reply;
    },
  });

  instance.put("/files/:sha256", {
    config: {
      adminOnly: true,
    },
    schema: {
      tags: ["Files"],
      operationId: "createUploadUrl",
      params: T.Object({
        sha256: T.String(),
      }),
      querystring: T.Object({
        fileName: T.String(),
        contentType: T.String(),
        createdAt: T.Integer(),
      }),
      response: {
        200: T.Object({
          uploadUrl: T.String(),
        }),
      },
    },
    handler: async function (request, reply) {
      const { sha256 } = request.params;
      const { fileName, contentType, createdAt } = request.query;

      const uploadUrl = await FileService.getUploadUrl({
        sha256,
        fileName,
        contentType,
        createdAt,
      });

      return reply.status(200).send({ uploadUrl });
    },
  });

  instance.delete("/files/:sha256", {
    config: {
      adminOnly: true,
    },
    schema: {
      operationId: "markForDeletion",
      tags: ["Files"],
      params: T.Object({
        sha256: T.String(),
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

  instance.get("/files/:sha256/metadata", {
    schema: {
      operationId: "getMetadata",
      tags: ["Files"],
      params: T.Object({
        sha256: T.String(),
      }),
      response: {
        200: T.Object({}),
      },
    },
    preHandler: (request, reply) => {
      FileService.authorize(request.user.id, request.params.sha256);
    },
    handler: (request, reply) => {
      const metadata = FileService.getFileMetadata(request.params.sha256);
    },
  });
};

export default plugin;

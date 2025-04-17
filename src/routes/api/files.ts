import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FileService } from "services/file-service";

import { authenticate } from "server/hooks/auth";

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

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
      }),
      response: {
        200: T.Object({
          uploadUrl: T.String(),
        }),
      },
    },
    handler: async function (request, reply) {
      const { sha256 } = request.params;
      const { fileName, contentType } = request.query;

      const uploadUrl = await FileService.getUploadUrl({
        sha256,
        fileName,
        contentType,
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
};

export default plugin;

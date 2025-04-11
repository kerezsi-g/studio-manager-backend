import { Type as T } from "@typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FileService } from "services/file-service";
import { StorageType } from "types/enums";
import { authenticate } from "server/hooks/auth";

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.get("/files/:fileId", {
    schema: {
      operationId: "getAccessUrl",
      tags: ["Files"],
      params: T.Object({
        fileId: T.String(),
      }),
      response: {
        200: T.Object({
          url: T.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { fileId } = request.params;

      const url = await FileService.getDownloadUrl(request.user.id, fileId);

      return reply.status(200).send({ url });
    },
  });

  instance.post("/files", {
    config: {
      adminOnly: true,
    },
    schema: {
      tags: ["Files"],
      operationId: "getUploadUrl",
      body: T.Object({
        hash: T.String(),
        fileName: T.String(),
      }),
      response: {
        200: T.Object({
          uploadUrl: T.String(),
        }),
      },
    },
    handler: async function (request, reply) {
      const { hash, fileName } = request.body;

      const uploadUrl = await FileService.getUploadUrl(hash, {
        fileName,
        storageType: StorageType.Local,
      });

      return reply.status(200).send({ uploadUrl });
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

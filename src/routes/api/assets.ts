import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FileService } from "services/file-service";

import { authenticate } from "server/hooks/auth";
import { AudioPeaks } from "schemas/AudioPeaks.type";
import { AssetService } from "services";
import { AssetTypeSchema } from "schemas";

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(AudioPeaks);
  instance.addSchema(AssetTypeSchema);

  instance.post("/assets", {
    schema: {
      operationId: "createAsset",
      tags: ["Assets"],
      body: T.Object(
        {
          assetName: T.String(),
          assetType: AssetTypeSchema,
        },
        {
          title: "CreateAssetRequest",
        }
      ),
      response: {
        200: T.Object({
          assetId: T.String(),
          assetName: T.String(),
          assetType: AssetTypeSchema,
          createdAt: T.Integer(),
        }),
      },
    },
    handler: (request, reply) => {
      const { assetName, assetType } = request.body;

      const asset = AssetService.createAsset({ assetName, assetType });

      reply.status(200).send(asset);
    },
  });

  instance.get("/assets/:assetId/files/:fileClass", {
    schema: {
      operationId: "getPublicAccessUrl",
      tags: ["Assets"],
      params: T.Object({
        assetId: T.String(),
        fileClass: T.String(),
      }),
      response: {
        200: T.Object({
          url: T.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { assetId, fileClass } = request.params;

      const publicUrl = await AssetService.getPublicAccessUrl(request.user.id, {
        assetId,
        fileClass,
      });

      return reply.redirect(publicUrl);
    },
  });

  instance.post("/assets/:assetId/files/:fileClass", {
    schema: {
      operationId: "getFileUploadUrl",
      tags: ["Assets"],
      params: T.Object({
        assetId: T.String(),
        fileClass: T.String(),
      }),
      querystring: T.Object({
        fileName: T.String(),
        sha256: T.String(),
        contentType: T.String(),
        createdAt: T.Integer(),
      }),
      response: {
        200: T.Object({
          url: T.String(),
        }),
      },
    },
    handler: (request, reply) => {
      const { assetId, fileClass } = request.params;

      const uploadUrl = AssetService.createUploadUrl({
        assetId,
        fileClass,
        fileName: request.query.fileName,
        sha256: request.query.sha256,
        contentType: request.query.contentType,
        createdAt: request.query.createdAt,
      });

      reply.status(200).send({ url: uploadUrl });
    },
  });

  instance.patch("/assets/:assetId/files/:fileClass", {
    schema: {
      operationId: "markFileAsUploaded",
      tags: ["Assets"],
      params: T.Object({
        assetId: T.String(),
        fileClass: T.String(),
      }),
      response: {
        200: T.Object({
          msg: T.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { assetId, fileClass } = request.params;

      await AssetService.uploadedCallback(request.user.id, {
        assetId,
        fileClass,
      });

      return reply.status(200).send({ msg: "Processing complete" });
    },
  });
};

export default plugin;

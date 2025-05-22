import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { authenticate } from "server/hooks/auth";

import { ProjectsService, IssueService } from "services";
import {
  Issue,
  AssetTag,
  ProjectAsset,
  UserData,
  Project,
  ProjectDetails,
  AssetTypeSchema,
  AssetTagSchema,
} from "schemas";

const ProjectIdSchema = T.Object({
  projectId: T.String(),
});

const MessageSchema = T.Object({
  msg: T.String(),
});

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(Issue);

  instance.get("/issues", {
    schema: {
      tags: ["Issues"],
      operationId: "getIssues",
    },
    handler: (request, reply) => {
      throw new Error("Not implemented");
    },
  });

  instance.post("/issues", {
    schema: {
      operationId: "createIssue",
      tags: ["Issues"],
      body: T.Object(
        {
          projectId: T.String(),
          fileId: T.String(),
          description: T.String(),
          timestamp: T.Optional(T.Number()),
          duration: T.Optional(T.Number()),
        },
        {
          title: "CreateIssueRequest",
        }
      ),
      response: {
        200: T.Object({
          issueId: T.String(),
        }),
      },
    },
    handler: (request, reply) => {
      const { projectId, fileId, description, timestamp = null, duration = null } = request.body;

      const issueId = IssueService.createIssue({
        userId: request.user.id,
        projectId,
        fileId,
        description,
        timestamp,
        duration,
      });

      reply.status(200).send({ issueId });
    },
  });

  instance.patch("/issues/:issueId", {
    schema: {
      operationId: "resolveIssue",
      tags: ["Issues"],
      params: T.Object({
        issueId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { issueId } = request.params;

      IssueService.resolveIssue({ userId: request.user.id, issueId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

export default plugin;

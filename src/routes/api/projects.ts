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
  AssetType,
} from "schemas";
import { FileService } from "services/file-service";

const ProjectIdSchema = T.Object({
  projectId: T.String(),
});

const MessageSchema = T.Object({
  msg: T.String(),
});

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(AssetTagSchema);
  instance.addSchema(AssetTypeSchema);
  instance.addSchema(UserData);
  instance.addSchema(Project);
  instance.addSchema(ProjectDetails);
  instance.addSchema(ProjectAsset);
  instance.addSchema(Issue);

  instance.get("/projects", {
    schema: {
      operationId: "getProjects",
      tags: ["Projects"],
      response: {
        200: T.Array(T.SchemaRef(Project)),
      },
    },
    handler: (request, reply) => {
      const projects = ProjectsService.getProjectsByUserId(request.user.id);
      reply.status(200).send(projects);
    },
  });

  instance.post("/projects", {
    schema: {
      operationId: "createProject",
      tags: ["Projects"],
      body: T.Object(
        {
          projectName: T.String(),
          projectType: T.String(),
          subject: T.String(),
        },
        { title: "CreateProjectRequest" }
      ),
      response: {
        200: ProjectIdSchema,
      },
    },
    handler: (request, reply) => {
      const { projectName, projectType, subject } = request.body;

      const project = ProjectsService.createProject({ projectName, projectType, subject });

      ProjectsService.addProjectMember({ projectId: project.projectId, userId: request.user.id });

      reply.status(200).send({ projectId: project.projectId });
    },
  });

  instance.get("/projects/:projectId", {
    schema: {
      operationId: "getProjectDetails",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      response: {
        200: T.SchemaRef(ProjectDetails),
      },
    },
    handler: (request, reply) => {
      const data = ProjectsService.getProjectDetails({
        userId: request.user.id,
        projectId: request.params.projectId,
      });

      reply.status(200).send(data);
    },
  });

  instance.patch("/projects/:projectId", {
    schema: {
      operationId: "updateProject",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      body: T.Object(
        {
          projectName: T.Optional(T.String()),
          subject: T.Optional(T.String()),
        },
        {
          title: "UpdateProjectRequest",
        }
      ),
      response: {
        200: ProjectIdSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId } = request.params;
      const { projectName } = request.body;

      ProjectsService.updateProject({ projectId, projectName });

      reply.status(200).send({ projectId });
    },
  });

  instance.delete("/projects/:projectId", {
    schema: {
      operationId: "deleteProject",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      throw new Error("Not implemented");
    },
  });

  instance.put("/projects/:projectId/assets/:assetType/:fileId", {
    schema: {
      operationId: "createAsset",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        assetType: T.SchemaRef(AssetTypeSchema),
        fileId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, assetType, fileId } = request.params;

      ProjectsService.createAsset({ projectId, assetType, fileId });

      reply.status(200).send({ msg: "OK" });
    },
  });

  instance.delete("/projects/:projectId/assets/:assetType/:fileId", {
    schema: {
      operationId: "deleteAsset",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        assetType: T.SchemaRef(AssetTypeSchema),
        fileId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, assetType, fileId } = request.params;

      ProjectsService.deleteAsset({ projectId, assetType, fileId });

      reply.status(200).send({ msg: "OK" });
    },
  });

  instance.patch("/projects/:projectId/assets/:assetType/:fileId", {
    schema: {
      operationId: "setAssetTag",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        assetType: T.SchemaRef(AssetTypeSchema),
        fileId: T.String(),
      }),
      querystring: T.Object({
        tag: T.SchemaRef(AssetTagSchema),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, assetType, fileId } = request.params;

      ProjectsService.tagAsset({ projectId, assetType, fileId }, request.query.tag);

      reply.status(200).send({ msg: "OK" });
    },
  });

  instance.get("/projects/:projectId/background-image", {
    schema: {
      operationId: "getBackgroundImage",
      hide: true,
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
    },
    handler: async (request, reply) => {
      const { projectId } = request.params;

      const assets = ProjectsService.getAssetsByType(projectId, AssetType.BackgroundImage);

      if (assets.length == 0) {
        reply.status(404).send();
        return;
      }

      const url = await FileService.getDownloadUrl(assets[0].fileId);

      return reply.redirect(url, 302);
    },
  });

  instance.get("/projects/:projectId/thumbnail", {
    schema: {
      operationId: "getThumbnail",
      hide: true,
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
    },
    handler: async (request, reply) => {
      const { projectId } = request.params;

      const assets = ProjectsService.getAssetsByType(projectId, AssetType.Thumbnail);

      if (assets.length == 0) {
        reply.status(404).send();
        return;
      }

      const url = await FileService.getDownloadUrl(assets[0].fileId, "thumbnail");

      return reply.redirect(url, 302);
    },
  });

  instance.get("/projects/:projectId/users", {
    schema: {
      operationId: "getProjectMembers",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      response: {
        200: T.Array(T.SchemaRef(UserData)),
      },
    },
    handler: (request, reply) => {
      const { projectId } = request.params;

      const users = ProjectsService.getProjectMembers(projectId);

      reply.status(200).send(users);
    },
  });

  instance.put("/projects/:projectId/users/:userId", {
    schema: {
      operationId: "addUserToProject",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        userId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, userId } = request.params;

      ProjectsService.addProjectMember({ projectId, userId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });

  instance.delete("/projects/:projectId/users/:userId", {
    schema: {
      operationId: "removeUserFromProject",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        userId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, userId } = request.params;

      if (userId === request.user.id) {
        reply.status(400).send({
          msg: "You cannot remove yourself from a project",
        });
        return;
      }

      ProjectsService.removeProjectMember({ projectId, userId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

export default plugin;

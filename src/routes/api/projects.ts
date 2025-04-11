import { Type as T } from "@typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { CreateProject } from "queries/CreateProject";
import { CreateIssue } from "queries/CreateIssue";
import { GetUserProjects } from "queries/GetUserProjects";
import { AddUserToProject } from "queries/AddUserToProject";
import { RemoveUserFromProject } from "queries/RemoveUserFromProject";
import { RemoveFileFromProject } from "queries/RemoveFileFromProject";
import { UpdateProject } from "queries/UpdateProject";
import { GetProjectUsers } from "queries/GetProjectUsers";
import { ResolveIssue } from "queries/ResolveIssue";
import { AddFileToProject } from "queries/AddFileToProject";
import { authenticate } from "server/hooks/auth";
import { Project } from "schemas/Project.type";
import { UserData } from "schemas/UserData.type";
import { ProjectDetails } from "schemas/ProjectDetails.type";
import { ProjectsService } from "services/projects-service";

const ProjectIdSchema = T.Object({
  projectId: T.String(),
});

const MessageSchema = T.Object({
  msg: T.String(),
});

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(Project);
  instance.addSchema(ProjectDetails);
  instance.addSchema(UserData);

  instance.get("/projects", {
    schema: {
      operationId: "getProjects",
      tags: ["Projects"],
      response: {
        200: T.Array(T.SchemaRef(Project)),
      },
    },
    handler: (request, reply) => {
      const projects = GetUserProjects({ userId: request.user.id });
      reply.status(200).send(projects);
    },
  });

  instance.post("/projects", {
    schema: {
      operationId: "createProject",
      tags: ["Projects"],
      body: T.Object({
        projectName: T.String(),
        projectType: T.String(),
      }),
      response: {
        200: ProjectIdSchema,
      },
    },
    handler: (request, reply) => {
      const { projectName, projectType } = request.body;

      const projectId = CreateProject({ projectName, projectType });

      /**
       * Auto-add user to project members
       */
      AddUserToProject({ projectId, userId: request.user.id });

      reply.status(200).send({ projectId });
    },
  });

  instance.patch("/projects/:projectId", {
    schema: {
      operationId: "updateProject",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      body: T.Object({
        projectName: T.String(),
        // projectType: T.String(),
      }),
      response: {
        200: ProjectIdSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId } = request.params;
      const { projectName } = request.body;

      UpdateProject({ projectId, projectName });

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

      const users = GetProjectUsers({ projectId });

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

      AddUserToProject({ projectId, userId });

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

      RemoveUserFromProject({ projectId, userId });

      reply.status(200).send({
        msg: "OK",
      });
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
      const data = ProjectsService.getProjectDetails(request.user.id, request.params.projectId);

      reply.status(200).send(data);
    },
  });

  instance.get("/projects/:projectId/files", {
    schema: {
      tags: ["Projects"],
      operationId: "getProjectFiles",
      params: T.Object({
        projectId: T.String(),
      }),
    },
    handler: (request, reply) => {},
  });

  instance.put("/projects/:projectId/files/:fileId", {
    schema: {
      tags: ["Projects"],
      operationId: "addFileToProject",
      params: T.Object({
        projectId: T.String(),
        fileId: T.String(),
      }),
      querystring: T.Object({
        category: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, fileId } = request.params;
      const { category } = request.query;

      AddFileToProject({ projectId, fileId, category });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });

  instance.delete("/projects/:projectId/files/:fileId", {
    schema: {
      tags: ["Projects"],
      operationId: "removeFileFromProject",
      querystring: T.Object({
        category: T.String(),
      }),
      params: T.Object({
        projectId: T.String(),
        fileId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, fileId } = request.params;
      const { category } = request.query;

      RemoveFileFromProject({ projectId, fileId, category });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });

  instance.get("/projects/:projectId/issues", {
    schema: {
      tags: ["Projects"],
      operationId: "getIssues",
    },
    handler: (request, reply) => {},
  });

  instance.post("/projects/:projectId/issues", {
    schema: {
      operationId: "createIssue",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      body: T.Object({
        description: T.String(),
        timestamp: T.Optional(T.Integer()),
        duration: T.Optional(T.Integer()),
      }),
      response: {
        200: T.Object({
          issueId: T.String(),
        }),
      },
    },
    handler: (request, reply) => {
      const { projectId } = request.params;
      const { description, timestamp = null, duration = null } = request.body;

      const issueId = CreateIssue({
        userId: request.user.id,
        projectId,
        description,
        timestamp,
        duration,
      });

      reply.status(200).send({ issueId });
    },
  });

  instance.patch("/projects/:projectId/issues/:issueId", {
    schema: {
      operationId: "resolveIssue",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
        issueId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, issueId } = request.params;

      ResolveIssue({ userId: request.user.id, projectId, issueId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

export default plugin;

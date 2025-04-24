import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { authenticate } from "server/hooks/auth";
import { Project } from "schemas/Project.type";
import { UserData } from "schemas/UserData.type";
import { ProjectDetails } from "schemas/ProjectDetails.type";

import { ProjectsService, IssueService } from "services";
import { ProjectMedia } from "schemas/ProjectMedia.type";
import { Issue } from "schemas/Issue.type";

const ProjectIdSchema = T.Object({
  projectId: T.String(),
});

const MessageSchema = T.Object({
  msg: T.String(),
});

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(Project);
  instance.addSchema(ProjectMedia);
  instance.addSchema(Issue);
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
      const projects = ProjectsService.getProjectsByUserId(request.user.id);
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

      const project = ProjectsService.createProject({ projectName, projectType });

      /**
       * Auto-add user to project members
       */
      ProjectsService.addProjectMember({ projectId: project.projectId, userId: request.user.id });

      reply.status(200).send({ projectId: project.projectId });
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

  instance.get("/projects/:projectId/files", {
    schema: {
      tags: ["Projects"],
      operationId: "getProjectFiles",
      params: T.Object({
        projectId: T.String(),
      }),
    },
    handler: (request, reply) => {
      throw new Error("Not implemented");
    },
  });

  instance.put("/projects/:projectId/files/:sha256", {
    schema: {
      tags: ["Projects"],
      operationId: "addFileToProject",
      params: T.Object({
        projectId: T.String(),
        sha256: T.String(),
      }),
      querystring: T.Object({
        tag: T.String(),
        path: T.Optional(T.String()),
        fileName: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, sha256 } = request.params;
      const { tag, path, fileName } = request.query;

      ProjectsService.linkFileToProject({ projectId, sha256, tag, path, fileName });

      reply.status(200).send({ msg: "OK" });
    },
  });

  instance.delete("/projects/:projectId/files/:sha256", {
    schema: {
      tags: ["Projects"],
      operationId: "removeFileFromProject",
      params: T.Object({
        projectId: T.String(),
        sha256: T.String(),
      }),
      querystring: T.Object({
        tag: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { projectId, sha256 } = request.params;
      const { tag } = request.query;

      ProjectsService.unlinkFileFromProject({ projectId, sha256, tag });

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
    handler: (request, reply) => {
      throw new Error("Not implemented");
    },
  });

  instance.post("/projects/:projectId/issues", {
    schema: {
      operationId: "createIssue",
      tags: ["Projects"],
      params: T.Object({
        projectId: T.String(),
      }),
      body: T.Object({
        file: T.String(),
        description: T.String(),
        timestamp: T.Optional(T.Number()),
        duration: T.Optional(T.Number()),
      }),
      response: {
        200: T.Object({
          issueId: T.String(),
        }),
      },
    },
    handler: (request, reply) => {
      const { projectId } = request.params;
      const { description, timestamp = null, duration = null, file } = request.body;

      const issueId = IssueService.createIssue({
        userId: request.user.id,
        file,
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

      IssueService.resolveIssue({ userId: request.user.id, projectId, issueId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

export default plugin;

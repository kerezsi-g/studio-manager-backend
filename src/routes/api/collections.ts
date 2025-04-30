import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { AddProjectToCollection } from "services/collections-service/queries/AddProjectToCollection";
import { CreateCollection } from "services/collections-service/queries/CreateCollection";
import { RemoveProjectFromCollection } from "services/collections-service/queries/RemoveProjectFromCollection";
import { UpdateCollection } from "services/collections-service/queries/UpdateCollection";
import { GetUserCollections } from "services/collections-service/queries/GetUserCollections";
import { authenticate } from "server/hooks/auth";
import { Project } from "schemas/Project.type";
import { Collection } from "schemas/Collection.type";
import { GetProjectsInCollection } from "services/collections-service/queries/GetProjectsInCollection";

const CollectionIdSchema = T.Object({
  collectionId: T.String(),
});

const MessageSchema = T.Object({
  msg: T.String(),
});

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(Collection);
  instance.addSchema(Project);

  instance.get("/collections", {
    schema: {
      operationId: "getCollections",
      tags: ["Collections"],
      response: {
        200: T.Array(T.SchemaRef(Collection)),
      },
    },
    handler: (request, reply) => {
      const collections = GetUserCollections({ userId: request.user.id });

      reply.status(200).send(collections);
    },
  });

  instance.post("/collections", {
    schema: {
      operationId: "createCollection",
      tags: ["Collections"],
      body: T.Object({
        collectionName: T.String(),
      }, {
		title: "CreateCollectionRequest"
	  }),
      response: {
        200: CollectionIdSchema,
      },
    },
    handler: (request, reply) => {
      const { collectionName } = request.body;

      const collectionId = CreateCollection({ collectionName });

      reply.status(200).send({ collectionId });
    },
  });

  instance.patch("/collections/:collectionId", {
    schema: {
      operationId: "updateCollection",
      tags: ["Collections"],
      params: T.Object({
        collectionId: T.String(),
      }),
      body: T.Object({
        collectionName: T.String(),
      }, {
		title: "UpdateCollectionRequest"
	  }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { collectionId } = request.params;
      const { collectionName } = request.body;

      UpdateCollection({ collectionId, collectionName });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });

  instance.get("/collections/:collectionId/projects", {
    schema: {
      operationId: "getProjectsInCollection",
      tags: ["Collections"],
      params: T.Object({
        collectionId: T.String(),
      }),
      response: {
        200: T.Array(T.SchemaRef(Project)),
      },
    },
    handler: (request, reply) => {
      const { collectionId } = request.params;

      const projects = GetProjectsInCollection({ userId: request.user.id, collectionId });

      reply.status(200).send(projects);
    },
  });

  instance.put("/collections/:collectionId/projects/:projectId", {
    schema: {
      operationId: "addProjectToCollection",
      tags: ["Collections"],
      params: T.Object({
        collectionId: T.String(),
        projectId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { collectionId, projectId } = request.params;

      AddProjectToCollection({ collectionId, projectId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });

  instance.delete("/collections/:collectionId/projects/:projectId", {
    schema: {
      operationId: "removeProjectFromCollection",
      tags: ["Collections"],
      params: T.Object({
        collectionId: T.String(),
        projectId: T.String(),
      }),
      response: {
        200: MessageSchema,
      },
    },
    handler: (request, reply) => {
      const { collectionId, projectId } = request.params;

      RemoveProjectFromCollection({ collectionId, projectId });

      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

export default plugin;

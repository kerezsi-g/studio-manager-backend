import { Type as T } from "@typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Logger } from "logger";

import { UserService } from "services/user-service";
import { authenticate } from "server/hooks/auth";
import { UserData } from "schemas/UserData.type";
import { MessageSchema } from "schemas/MessageSchema.type";

const logger = new Logger("API");

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(UserData);

  instance.post("/auth", {
    schema: {
      operationId: "signIn",
      tags: ["Auth"],
      body: T.Object(
        {
          email: T.String(),
          password: T.String(),
        },
        {
          $id: "authParams",
          title: "authParams",
        }
      ),
      response: {
        200: MessageSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const result = UserService.authenticate(email, password);

      const tokenPayload = {
        id: result.userId,
      };

      const token = await reply.jwtSign(tokenPayload);

      reply.setCookie("jwt", token, {
        path: "/api",
        httpOnly: true,
        secure: "auto",
      });

      reply.status(200).send({
        msg: "OK",
      });
    },
    config: {
      public: true,
    },
  });

  instance.get("/auth", {
    schema: {
      operationId: "validate",
      tags: ["Auth"],
      response: {
        200: T.SchemaRef(UserData),
      },
    },
    onRequest: async (request, reply) => {
      await request.jwtVerify();
    },
    handler: async (request, reply) => {
      const user = UserService.getUserById(request.user.id);

      reply.status(200).send(user);
    },
  });

  instance.delete("/auth", {
    schema: {
      operationId: "signOut",
      tags: ["Auth"],
      response: {
        200: MessageSchema,
      },
    },
    handler: async (request, reply) => {
      reply.clearCookie("jwt", {
        path: "/api",
      });
      reply.status(200).send({
        msg: "OK",
      });
    },
  });
};

logger.info("Routes initialized");

export default plugin;

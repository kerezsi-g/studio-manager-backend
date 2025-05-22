import { Type as T } from "utils/typebox-openapi";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Logger } from "logger";

import { UserService } from "services/user-service";
import { authenticate } from "server/hooks/auth";
import { UserData } from "schemas/UserData.type";
import { MessageSchema } from "schemas/MessageSchema.type";
import fastifyOAuth2 from "@fastify/oauth2";

import oauth from "oauth.json";

import { OAuth2Namespace } from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

const logger = new Logger("API");

const plugin: FastifyPluginAsyncTypebox = async function (instance) {
  instance.addHook("onRequest", authenticate);

  instance.addSchema(UserData);

//   instance.register(fastifyOAuth2, {
//     name: "googleOAuth2",
//     credentials: {
//       client: {
//         id: oauth.web.client_id,
//         secret: oauth.web.client_secret,
//       },
//       auth: fastifyOAuth2.GOOGLE_CONFIGURATION,
//     },
//     startRedirectPath: "/auth/oauth2",
//     callbackUri: "/oauth2/callback",
//   });

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
          title: "authParams",
        }
      ),
      response: {
        200: MessageSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const result = UserService.authenticate({ email, password });

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

      if (!user) {
        return reply.status(404).send();
      }

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

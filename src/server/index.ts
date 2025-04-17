import path from "node:path";

import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyCompress from "@fastify/compress";
import { requestLogger, Logger } from "logger";

import { RouteDefinitions } from "../routes";

import config from "config";

const { httpServer } = config;

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string };
    user: {
      id: string;
    };
  }
}

const logger = new Logger("HttpServer");

logger.info({ name: "HttpServer", msg: "Initializing..." });

const server = Fastify({
  loggerInstance: requestLogger,
  ajv: {
    customOptions: { coerceTypes: "array" },
  },
  ignoreTrailingSlash: true,
  bodyLimit: 10000000,
});

server.register(fastifyCompress);

server.register(fastifyCookie);

server.register(fastifyJwt, {
  secret: "hard-coded-jwt-secret-todo-fix-me", // TODO: Make jwt secret external
  decode: { complete: true },
  cookie: {
    cookieName: "jwt",
    signed: false,
  },
});

server.register(RouteDefinitions);

export async function startServer() {
  try {
    await server.listen({
      port: httpServer.port,
    });

    await server.ready();

    logger.info({
      msg: `Server started successfully, listening on port ${httpServer.port}`,
    });

    const resp = await fetch(`http://localhost:${httpServer.port}/api/reference/json`);
    const spec = await resp.json();

    await Bun.write("api-client/spec.json", JSON.stringify(spec, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

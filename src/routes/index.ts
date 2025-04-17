import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import { FastifyInstance } from "fastify";
import { fastifyAutoload } from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { OasConfig } from "./oas";
import config from "config";

const API_ROUTES_FOLDERS = ["/api"];

declare module "fastify" {
  interface FastifyContextConfig {
    public?: boolean;
    adminOnly?: boolean;
  }
}

export async function RouteDefinitions(instance: FastifyInstance) {
  /**
   * Register swagger config
   */
  instance.register(fastifySwagger, OasConfig);

  /**
   * Expose swagger documentation based on server configuration
   */
  if (config.httpServer.exposeApiDocs) {
    instance.register(fastifySwaggerUi, {
      routePrefix: "/api/reference",
    });
  }

  /**
   * Autoload all API routes, based on the constant declared at the top of the file
   */
  API_ROUTES_FOLDERS.forEach((folderName) => {
    instance.register(fastifyAutoload, {
      dir: fileURLToPath(dirname(import.meta.url)) + folderName,
      options: {
        prefix: folderName,
        encapsulate: false,
      },
    });
  });
}

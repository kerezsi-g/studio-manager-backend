import { version } from "#package";
import { SwaggerOptions } from "@fastify/swagger";

function sanitize(str: string) {
  return str.replace(/\//g, "_");
}

export const OasConfig: SwaggerOptions = {
  mode: "dynamic",
  stripBasePath: true,
  /**
   * Custom refResolver required to generate schemas with correct names
   * instead of 'def-0', 'def-1', and such bull$hit by default
   *
   * @see https://github.com/fastify/fastify-swagger#managing-your-refs
   */
  transform: ({ schema, url, route }) => {
    if (!schema.operationId) {
      console.warn(`Route ${route.method}:${url} does not have an operationId`);
    }

    if (!schema.summary) {
      schema.summary = schema.operationId;
    }

    return { schema, url, route };
  },
  refResolver: {
    buildLocalReference: (json, baseUri, fragment, i) => {
      if (typeof json.$id !== "string") {
        console.error(json);
        throw new Error("Schema must have an $id");
      }

      const sanitizedId = sanitize(json.$id);

      // Making my life easier
      if (json.$id != sanitizedId) {
        console.warn(`Schema id ${json.$id} not in expected format`);
        json.$id = sanitizedId;
      }

      // Also set the title to the sanitized version if it's undefined, for swagger UI purposes
      if (!json.title) {
        console.warn(`Schema ${json.$id} does not have a title`);
        json.title = sanitizedId;
      }

      return sanitizedId;
    },
  },
  openapi: {
    info: {
      title: "",
      description: "",
      version,
      contact: {
        name: "",
        email: "",
      },
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        /**
         * Add security schemes here
         */
      },
    },
    security: [
      /**
       * Reference security schemes here
       */
    ],
  },
};

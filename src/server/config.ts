import { Type as T } from "@typebox";
import { createConfig } from "utils/createConfig";

const schema = T.Object({
  port: T.Integer({ default: 3000 }),
  exposeApiDocs: T.Boolean({ default: true }),
  allowedOrigins: T.Array(T.String({ default: [] })),
  fileServer: T.Object({
    enabled: T.Boolean({ default: false }),
    path: T.Optional(T.String()),
    defaultFile: T.Optional(T.String()),
  }),
});

export default createConfig("server", schema);

import { createConfig } from "utils/create-config-file";
import { Type } from "@sinclair/typebox";

export default createConfig(
  "config",
  Type.Object({
    httpServer: Type.Object({
      port: Type.Integer({ default: 3000 }),
      exposeApiDocs: Type.Boolean({ default: true }),
      allowedOrigins: Type.Array(Type.String({ default: [] })),
    }),
    s3: Type.Object({
      endpoint: Type.String(),
      bucket: Type.String(),
      accessKeyId: Type.String(),
      secretAccessKey: Type.String(),
    }),
    thumbnailGeneration: Type.Object({
      maxWidth: Type.Integer({ default: 480 }),
      maxHeight: Type.Integer({ default: 360 }),
      quality: Type.Integer({ default: 85 }),
    }),
  })
);

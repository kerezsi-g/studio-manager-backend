import { Type as T, Static } from "utils/typebox-openapi";

const $id = "Issue";

export const Issue = T.Object(
  {
    issueId: T.String(),
    file: T.String({
      description: "SHA-256 hash of the linked file",
    }),
    userId: T.String(),
    description: T.String(),
    timestamp: T.Nullable(T.Number()),
    duration: T.Nullable(T.Number()),
    createdAt: T.Integer(),
    resolvedAt: T.Nullable(T.Integer()),
  },
  { $id }
);

export type Issue = Static<typeof Issue>;

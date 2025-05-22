import { Type as T, Static } from "utils/typebox-openapi";

const $id = "Issue";

export const Issue = T.Object(
  {
    issueId: T.String(),
    projectId: T.String(),
    fileId: T.String(),
    userId: T.String(),
    description: T.String(),
    timestamp: T.Nullable(T.Number()),
    duration: T.Nullable(T.Number()),
    createdAt: T.Integer(),
    resolvedAt: T.Optional(T.Nullable(T.Integer())),
  },
  { $id }
);

export type Issue = Static<typeof Issue>;

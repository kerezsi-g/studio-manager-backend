import { Type as T, Static } from "@typebox";

const $id = "Issue";

export const Issue = T.Object(
  {
    issueId: T.String(),
    userId: T.String(),
    description: T.String(),
    timestamp: T.Nullable(T.Integer()),
    duration: T.Nullable(T.Integer()),
    createdAt: T.Integer(),
    resolvedAt: T.Nullable(T.Integer()),
  },
  { $id }
);

export type Issue = Static<typeof Issue>;

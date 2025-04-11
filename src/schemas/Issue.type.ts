import { Type as T, Static } from "@typebox";

const $id = "Issue";

export const Issue = T.Object(
  {
    issueId: T.String(),
    userId: T.String(),
    description: T.String(),
    timestamp: T.Integer(),
    duration: T.Integer(),
    createdAt: T.Integer(),
    resolvedAt: T.Integer(),
  },
  { $id }
);

export type Issue = Static<typeof Issue>;

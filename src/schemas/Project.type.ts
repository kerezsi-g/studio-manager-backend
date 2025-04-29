import { Type as T, Static } from "utils/typebox-openapi";

const $id = "Project";

export const Project = T.Object(
  {
    projectId: T.String(),
    projectName: T.String(),
    projectType: T.String(),
    subject: T.String(),
    createdAt: T.Integer(),
    thumbnail: T.Nullable(T.String()),
  },
  { $id }
);

export type Project = Static<typeof Project>;

import { Type as T, Static } from "utils/typebox-openapi";

const $id = "Project";

export const Project = T.Object(
  {
    projectId: T.String(),
    projectName: T.String(),
    projectType: T.String(),
    createdAt: T.Integer(),
  },
  { $id }
);

export type Project = Static<typeof Project>;

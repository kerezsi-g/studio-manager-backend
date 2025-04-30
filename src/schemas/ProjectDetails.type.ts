import { Type as T, Static } from "utils/typebox-openapi";
import { ProjectAsset } from "./ProjectAsset";
import { Issue } from "./Issue.type";
import { ProjectType } from "./ProjectType.type";

const $id = "ProjectDetails";

export const ProjectDetails = T.Object(
  {
    projectId: T.String(),
    projectName: T.String(),
    projectType: ProjectType,
    subject: T.String(),
    createdAt: T.Integer(),
    assets: T.Array(T.SchemaRef(ProjectAsset)),
    issues: T.Array(T.SchemaRef(Issue)),
  },
  { $id }
);

export type ProjectDetails = Static<typeof ProjectDetails>;

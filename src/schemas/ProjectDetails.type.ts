import { Type as T, Static } from "utils/typebox-openapi";
import { ProjectMedia } from "./ProjectMedia.type";
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
    files: T.Array(T.SchemaRef(ProjectMedia)),
    issues: T.Array(T.SchemaRef(Issue))
  },
  { $id }
);

export type ProjectDetails = Static<typeof ProjectDetails>;

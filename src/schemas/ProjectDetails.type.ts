import { Type as T, Static } from "@typebox";
import { ProjectMedia } from "./ProjectMedia.type";
import { Issue } from "./Issue.type";

const $id = "ProjectDetails";

export const ProjectDetails = T.Object(
  {
    projectId: T.String(),
    projectName: T.String(),
    projectType: T.String(),
    createdAt: T.Integer(),
    files: T.Array(T.SchemaRef(ProjectMedia)),
    issues: T.Array(T.SchemaRef(Issue)),
    /**
     * Define properties here
     */
  },
  { $id }
);

export type ProjectDetails = Static<typeof ProjectDetails>;

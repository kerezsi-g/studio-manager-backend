import { Type as T, Static } from "@typebox";

const $id = "ProjectMedia";

export const ProjectMedia = T.Object(
  {
    fileId: T.String(),
    fileType: T.String(),
    createdAt: T.Integer(),
  },
  { $id }
);

export type ProjectMedia = Static<typeof ProjectMedia>;

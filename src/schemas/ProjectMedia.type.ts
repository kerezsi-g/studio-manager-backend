import { Type as T, Static } from "@typebox";

const $id = "ProjectMedia";

export const ProjectMedia = T.Object(
  {
    sha256: T.String(),
    contentType: T.String(),
    fileName: T.String(),
    path: T.String(),
    tag: T.String(),
    addedAt: T.Integer(),
  },
  { $id }
);

export type ProjectMedia = Static<typeof ProjectMedia>;

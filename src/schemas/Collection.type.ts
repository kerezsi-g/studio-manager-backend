import { Type as T, Static } from "utils/typebox-openapi";

const $id = "Collection";

export const Collection = T.Object(
  {
    collectionId: T.String(),
    collectionName: T.String(),
    createdAt: T.Integer(),
    projectCount: T.Integer(),
    lastModified: T.Integer(),
  },
  { $id }
);

export type Collection = Static<typeof Collection>;

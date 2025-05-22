import { Type as T, Static } from "utils/typebox-openapi";
import { AssetTagSchema, AssetTypeSchema } from "./enums";

const $id = "ProjectAsset";

/**
 * Wraps the asset with its primary file record
 */
export const ProjectAsset = T.Object(
  {
    projectId: T.String(),
    fileId: T.String(),
    assetType: T.SchemaRef(AssetTypeSchema),
    assetName: T.String(),
    tag: T.Nullable(T.SchemaRef(AssetTagSchema)),
    uploadedAt: T.Integer(),
    contentType: T.String(),
    size: T.Integer(),
  },
  { $id }
);

export type ProjectAsset = Static<typeof ProjectAsset>;

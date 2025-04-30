import { Type as T, Static } from "utils/typebox-openapi";
import { AssetTag } from "./AssetTag.type";

const $id = "ProjectAsset";

/**
 * Wraps the asset with its primary file record
 */
export const ProjectAsset = T.Object(
  {
    assetId: T.String(),
    assetName: T.String(),
    tag: T.SchemaRef(AssetTag),
    addedAt: T.Integer(),
    uploadedAt: T.Integer(),
    createdAt: T.Integer(),
    contentType: T.String(),
    size: T.Integer(),
  },
  { $id }
);

export type ProjectAsset = Static<typeof ProjectAsset>;

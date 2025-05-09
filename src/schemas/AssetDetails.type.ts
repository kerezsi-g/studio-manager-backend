import { Type as T, Static } from "utils/typebox-openapi";

const $id = "AssetDetails";

export const AssetDetails = T.Object(
  {
    assetId: T.String(),
    assetName: T.String(),
    assetType: T.String(),
    totalSize: T.Integer(),
    files: T.Array(
      T.Object({
        type: T.String(),
        fileName: T.String(),
        sha256: T.String(),
        contentType: T.String(),
        size: T.Integer(),
        createdAt: T.Integer(),
        uploadedAt: T.Integer(),
      })
    ),
  },
  { $id }
);

export type AssetDetails = Static<typeof AssetDetails>;

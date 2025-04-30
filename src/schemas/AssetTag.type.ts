import { Type as T, Static } from "utils/typebox-openapi";

const $id = "AssetTag";

export const AssetTag = T.StringEnum(["accepted", "rejected", "pending-review", "misc"], {
  $id,
});

export type AssetTag = Static<typeof AssetTag>;

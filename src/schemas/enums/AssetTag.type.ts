import { Type as T } from "utils/typebox-openapi";

const $id = "AssetTag";

export enum AssetTag {
  Accepted = "accepted",
  Rejected = "rejected",
  PendingReview = "pending-review",
}

export const AssetTagSchema = T.StringEnum(Object.values(AssetTag), { $id });

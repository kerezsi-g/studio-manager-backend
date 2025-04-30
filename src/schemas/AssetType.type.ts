import { Type as T } from "utils/typebox-openapi";

const $id = "AssetType";

export enum AssetType {
  Audio = "audio",
  Video = "video",
  Image = "image",
}

export const AssetTypeSchema = T.StringEnum(Object.values(AssetType), { $id });

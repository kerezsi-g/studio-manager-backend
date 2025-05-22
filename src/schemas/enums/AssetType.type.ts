import { Type as T } from "utils/typebox-openapi";

const $id = "AssetType";

export enum AssetType {
  Primary = "primary",
  Misc = "misc",
  BackgroundImage = "background-image",
  Thumbnail = "thumbnail",
}

export const AssetTypeSchema = T.StringEnum(Object.values(AssetType), { $id });

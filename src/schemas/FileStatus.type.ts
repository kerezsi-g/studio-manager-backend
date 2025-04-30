import { Type as T } from "utils/typebox-openapi";

const $id = "FileStatus";

export enum FileStatus {
  Pending = "pending",
  Processing = "processing",
  Processed = "processed",
  ProcessError = "process-error",
}

export const FileStatusSchema = T.StringEnum(Object.values(FileStatus), {
  $id,
});

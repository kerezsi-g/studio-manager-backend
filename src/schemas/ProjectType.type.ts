import { Type as T, Static } from "utils/typebox-openapi";

const $id = "ProjectType";

export const ProjectType = T.StringEnum(["audio", "video", "image"], { $id });

export type ProjectType = Static<typeof ProjectType>;

import { Type as T, Static } from "utils/typebox-openapi";

const $id = "MessageSchema";

export const MessageSchema = T.Object({
  msg: T.String(),
});

export type MessageSchema = Static<typeof MessageSchema>;

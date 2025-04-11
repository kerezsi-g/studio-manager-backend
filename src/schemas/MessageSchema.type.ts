import { Type as T, Static } from "@typebox";

const $id = "MessageSchema";

export const MessageSchema = T.Object({
  msg: T.String(),
});

export type MessageSchema = Static<typeof MessageSchema>;

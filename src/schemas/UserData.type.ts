import { Type as T, Static } from "utils/typebox-openapi";

const $id = "UserData";

export const UserData = T.Object(
  {
    userId: T.String(),
    name: T.String(),
    email: T.String(),
  },
  { $id }
);

export type UserData = Static<typeof UserData>;

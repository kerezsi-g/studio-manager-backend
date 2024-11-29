import { api, APIError, Header } from "encore.dev/api";
import { UserData } from "../types";
import { database } from "../../admin/db";

import { compareSync } from "bcrypt-ts";
import { getToken } from "../utils/auth-tools";
import { getAuthData } from "~encore/auth";

interface CheckIdentityResponse {
  data: UserData;
  token: string;
}

export const checkIdentity = api<{}, CheckIdentityResponse>(
  {
    method: "GET",
    path: "/users/auth",
    expose: true,
    auth: false,
  },

  async () => {
    const auth = getAuthData();

    if (!auth) throw APIError.notFound("Not authenticated");

    const user = await database.oneOrNone<UserData & { password: string }>(
      SqlQuery,
      { userId: auth.userID }
    );

    console.log(user);

    if (!user) throw APIError.notFound("Invalid credentials");

    const token = getToken(user.userId);

    return {
      data: {
        email: user.email,
        userId: user.userId,
      },
      token,
    };
  }
);

const SqlQuery = /*sql*/ `
	select		user_id			as "userId"
	,			email			as "email"
	,			password		as "password"
	from		t_users
	where		user_id = $<userId>
`;

// const invalidCredentialsError = {
//   statusCode: 404,
//   msg: "Invalid credentials",
// };

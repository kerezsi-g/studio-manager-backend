import { api, APIError, Header } from "encore.dev/api";
import { UserData } from "../types";
import { database } from "../../admin/db";

import { compareSync } from "bcrypt-ts";
import { getToken } from "../utils/auth-tools";

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  //   collectionId: string;
  data: UserData;
  token: string;
}

export const signIn = api<SignInRequest, SignInResponse>(
  {
    method: "POST",
    path: "/users/auth",
    expose: true,
    auth: false,
  },

  async ({ email, password }) => {
    const user = await database.oneOrNone<UserData & { password: string }>(
      SqlQuery,
      { email }
    );

    if (!user) throw APIError.notFound("Invalid credentials");

    const isValid = compareSync(password, user?.password);

    if (!isValid) throw APIError.notFound("Invalid credentials");

    const token = getToken(user.userId);

    return {
      data: {
        email,
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
	where		email = $<email>
`;

// const invalidCredentialsError = {
//   statusCode: 404,
//   msg: "Invalid credentials",
// };

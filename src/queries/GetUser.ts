import { db } from "../db";

type QueryParams = {
  userId: string | null;
  email: string | null;
};

type QueryResult = {
  userId: string;
  email: string;
  hashedPassword: string;
  name: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	SELECT 
		user_id		AS "userId",
		email		AS "email",
		password	AS "hashedPassword",
		name		AS "name",
		created_at	AS "createdAt"
	FROM
		t_users
	WHERE
		(@userId IS NULL OR user_id = @userId)
	AND
		(@email IS NULL OR email = @email)
	AND NOT -- allow only a single filter param
		(@email IS NULL AND @userId IS NULL)
	AND NOT -- allow only a single filter param
		(@email IS NOT NULL AND @userId IS NOT NULL)
`);

type Args = {
  userId?: string | null;
  email?: string | null;
};

export function GetUser({ userId = null, email = null }: Args) {
  if (!userId && !email) {
    throw new Error("userId or email must be provided");
  }

  const bindParams: QueryParams = {
    userId,
    email,
  };

  const result = sql.get(bindParams);

  if (result) {
    return result;
  } else {
    throw new Error("User not found");
  }
}

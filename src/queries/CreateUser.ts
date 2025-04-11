import { generateUuid } from "utils/generateUuid";
import { db } from "../db";

type QueryParams = {
  email: string;
  hashedPassword: string;
  name: string;
  userId: string;
  createdAt: number;
};

type QueryResult = {
  userId: string;
  email: string;
  hashedPassword: string;
  name: string;
  createdAt: number;
};

const sql = db.query<QueryResult, QueryParams>(/*sql*/ `
	INSERT INTO
		t_users (user_id, email, password, name, created_at)
	VALUES
		(@userId, @email, @hashedPassword, @name, @createdAt)
	RETURNING
		user_id 	AS "userId"
	,	email		AS "email"
	,	password	AS "hashedPassword"
	,	name		AS "name"
	,	created_at	AS "createdAt"	
`);

interface Args {
  email: string;
  password: string;
  name: string;
}

export async function CreateUser({ email, password, name }: Args) {
  const hashedPassword = await Bun.password.hash(password);

  const bindParams: QueryParams = {
    userId: generateUuid(),
    email,
    name,
    hashedPassword,
    createdAt: Date.now(),
  };

  const result = sql.get(bindParams);

  if (result) {
    return result;
  } else {
    throw new Error("Failed to create user");
  }
}

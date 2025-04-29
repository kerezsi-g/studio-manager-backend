import { UserData } from "schemas/UserData.type";

import * as Queries from "./queries";

export namespace UserService {
  interface CreateUserArgs {
    email: string;
    password: string;
    name: string;
  }

  export async function createUser({ email, password, name }: CreateUserArgs): Promise<UserData> {
    const hashedPassword = await Bun.password.hash(password);

    const result = Queries.CreateUser({ email, hashedPassword, name });

    if (!result) {
      throw new Error("Failed to create user");
    }

    return result;
  }

  interface AuthenticateArgs {
    email: string;
    password: string;
  }

  export function authenticate({ email, password }: AuthenticateArgs) {
    const user = Queries.GetUser({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = Bun.password.verify(password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  export function getUserById(userId: string) {
    return Queries.GetUser({ userId });
  }
}

const DEBUG_USER = {
  email: "test",
  password: "test",
  name: "test",
};

function insertDebugUser() {
  try {
    UserService.authenticate(DEBUG_USER);
  } catch {
    UserService.createUser(DEBUG_USER);
  }
}

insertDebugUser();

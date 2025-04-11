import { CreateUser } from "queries/CreateUser";
import { GetUser } from "queries/GetUser";

export namespace UserService {
  interface CreateUserArgs {
    email: string;
    password: string;
    name: string;
  }

  export function createUser(email: string, password: string, name: string) {
    const result = CreateUser({ email, password, name });

    return result;
  }

  export function authenticate(email: string, password: string) {
    const user = GetUser({ email });

    const isPasswordValid = Bun.password.verify(password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
    };
  }

  export function getUserById(userId: string) {
    return GetUser({ userId });
  }
}

const __DEBUG_USER = {
  email: "test",
  password: "test",
  name: "test",
};

export const DEBUG_USER = await UserService.createUser(
  __DEBUG_USER.email,
  __DEBUG_USER.password,
  __DEBUG_USER.name
);

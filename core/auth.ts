import { Header, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyToken } from "./utils/auth-tools";

// AuthParams specifies the incoming request information
// the auth handler is interested in. In this case it only
// cares about requests that contain the `Authorization` header.
interface AuthParams {
  authorization: Header<"Authorization">;
}

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
  userID: string;
  //   name: string;
}

// The auth handler itself.
export const jwtAuthHandler = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization;

  const decoded = verifyToken(token);

  return { userID: decoded.sub! };
});

// Define the API Gateway that will execute the auth handler:
export const gateway = new Gateway({
  authHandler: jwtAuthHandler,
});

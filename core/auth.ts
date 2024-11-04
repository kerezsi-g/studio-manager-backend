import { Header, Gateway, Query } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

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
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  // TODO: Implement
  return { userID: "test-user-id" };
});

// Define the API Gateway that will execute the auth handler:
export const gateway = new Gateway({
  authHandler: auth,
});

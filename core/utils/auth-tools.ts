import jwt from "jsonwebtoken";
import { env } from "./env";
import { APIError } from "encore.dev/api";

// Created only for readability's sake, JWT uses seconds since 1970-01-01 not ms
enum Time {
  SECOND = 1,
  MINUTE = Time.SECOND * 60,
  HOUR = Time.MINUTE * 60,
  DAY = Time.HOUR * 24,
}

// const SECRET = env("JWT_SECRET");

/**
 * ! TODO: this should absolutely be stored somewhere else, securely
 */
const SECRET = "secret";

export function getToken(user_id: string) {
  const issued = new Date().getTime() / 1000; // getTime returns ms not second
  const expires = issued + Time.DAY;

  const payload = {
    sub: user_id,
    iat: issued,
    exp: expires,
  };

  const token = jwt.sign(payload, SECRET);

  return token;
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, SECRET);

    if (typeof payload === "string") throw "JWT verification returned string";

    return payload;
  } catch (e) {
    throw APIError.unauthenticated("Invalid credentials");
  }
}

import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  if (request.routeOptions.config.public) {
    return;
  }

  if (request.routeOptions.config.adminOnly) {
    // throw new Error("Not implemented");
  }

  await request.jwtVerify();
}

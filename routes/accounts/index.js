"use strict";

const { AuthorizationException } = require("../../common/exceptions/auth/AuthorizationException");
const { getAccessTokenFromHeader, getRefreshTokenFromHeader } = require("../../util/functions");
const { readAccountByIdSchema } = require("./schema");
const controller = require("./controller");

module.exports = async function (fastify, opts) {

  // SERVICE //

  const service = controller(fastify.keycloakAdmin);

  // ROUTES //

  fastify.get("/:id",
  //  { schema: readAccountByIdSchema },
    service.readAccountById)

  // fastify.post("/", {schema: createAccountSchema}, service.createAccount)

  // fastify.delete("/:id", {schema: deleteAccountSchema}, service.deleteAccount)

  fastify.get("/userInfo", {}, async (req, res) => {
    try {
      const token = getAccessTokenFromHeader(req);
      if (token) {
        return await fastify.keycloak.userinfo(token);
      } else throw new AuthorizationException();
    } catch (e) {
      console.log(e)
      throw new AuthorizationException();
    }
  });

  // fastify.post("/refreshToken", { onRequest: await fastify.protect }, async (req, res) => {
  //   try {
  //     const refreshToken = getRefreshTokenFromHeader(req);
  //     if (refreshToken) {
  //       return await fastify.keycloak.refresh(refreshToken);
  //     } else throw new Error();
  //   } catch (e) {
  //     throw new Error();
  //   }
  // });

  // fastify.post("/logout", {}, async (req, res) => {
  //   req.session.delete();
  // })
};

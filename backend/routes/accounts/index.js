"use strict";

const { getAccessTokenFromHeader, getRefreshTokenFromHeader } = require("../../util/functions");
module.exports = async function (fastify, opts) {

  // ROUTES //

  fastify.get("/userInfo", {}, async (req, res) => {
    try {
      const token = getAccessTokenFromHeader(req);
      if (token) {
        return await fastify.keycloak.userinfo(token);
      } else throw new Error();
    } catch (e) {
      throw new Error();
    }
  });

  fastify.post("/signup", {}, async (req, res) => {
    const { keycloakAdmin } = fastify;
    const { username, password } = req.body;

    try {
      // await keycloakAdmin.setConfig({
      //   realmName: 'eventmanager-react',
      // });
      // await keycloakAdmin.auth({
      //   username: 'admin',
      //   password: 'Pa55w0rd',
      //   grantType: 'password',
      //   clientId: 'admin-cli'
      // })
      await keycloakAdmin.setConfig({
        realmName: 'eventmanager-react',
    });
      const createdUser = await keycloakAdmin.users.create({
        username,
        // enabled required to be true in order to send actions email
        emailVerified: true,
        enabled: true,
      });
      if (createdUser && createdUser.id) {
        return {
          message: req.t("CREATE_ACCOUNT")
        }
      }
      return createdUser;
    } catch (e) {
      console.log(e)
      throw new Error();
    }
  });

  fastify.post("/refreshToken", { onRequest: await fastify.protect }, async (req, res) => {
    try {
      const refreshToken = getRefreshTokenFromHeader(req);
      if (refreshToken) {
        return await fastify.keycloak.refresh(refreshToken);
      } else throw new Error();
    } catch (e) {
      throw new Error();
    }
  });

  fastify.post("/logout", {}, async (req, res) => {
    req.session.delete();
  })
};

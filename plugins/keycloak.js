"use strict";

const fp = require("fastify-plugin");
const isEmpty = require("lodash/isEmpty")
const { AuthorizationException } = require("../common/exceptions/auth/AuthorizationException");
const { Issuer } = require("openid-client")
const { KeycloakAdminClient } = require("@keycloak/keycloak-admin-client/lib/client");
const { getAccessTokenFromHeader } = require("../util/functions");

const keycloakPlugin = async (fastify, opts) => {
    // CLIENT //
    const keycloakIssuer = await Issuer.discover(`${process.env.KEYCLOAK_URL}/auth/realms/${process.env.KEYCLOAK_REALM}`);
    // console.log('Discovered issuer %s %O', keycloak.issuer, keycloak.metadata);

    const client = new keycloakIssuer.Client({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        // client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        redirect_uris: ['http://localhost:3000', 'http://localhost:3001'],
        response_types: ['code'],
        token_endpoint_auth_method: 'none'
    })

    fastify.decorate("keycloak", client);

    fastify.decorate("protect", async (req, res) => {
        const token = getAccessTokenFromHeader(req)
        try {
            return await client.userinfo(token);
        } catch (e) {
            throw new AuthorizationException()
        }
    });

    fastify.decorate("authorize", async (req, res, roles) => {
        const token = getAccessTokenFromHeader(req);
        const userInfo = await client.userinfo(token);
        if (userInfo && !isEmpty(userInfo)) {
            return roles.some(r => userInfo.roles.indexOf(r) > -1)
        }
        return false;
    });

    // ADMIN //

    const keycloakAdmin = new KeycloakAdminClient({
        realmName: process.env.KEYCLOACK_REALM
    });

    fastify.decorate('keycloakAdmin', keycloakAdmin)
}

module.exports = fp(keycloakPlugin, { name: 'keycloak', dependencies: ['i18next'] })

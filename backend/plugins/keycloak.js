"use strict";

const fp = require("fastify-plugin");
const { AuthorizationException } = require("../common/exceptions/auth/AuthorizationException");
const { Issuer } = require("openid-client")
const { KeycloakAdminClient } = require("@keycloak/keycloak-admin-client/lib/client");

const keycloakPlugin = async (fastify, opts) => {
    // CLIENT //
    const keycloakIssuer = await Issuer.discover(`${process.env.KEYCLOAK_URL}/auth/realms/eventmanager-react`);
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
        if (req.headers['authorization']) {
            const token = req.headers['authorization'].split(' ')[1];
            try {
                return await client.userinfo(token);
            } catch (e) {
                throw new AuthorizationException()
            }
        } else {
            throw new AuthorizationException()
        }
    });


    // ADMIN //

    const keycloakAdmin = new KeycloakAdminClient({
        realmName: process.env.KEYCLOACK_REALM
    });

    await keycloakAdmin.auth({
        username: 'admin',
        password: 'Pa55w0rd',
        grantType: 'password',
        clientId: 'admin-cli'
    })

    // const keycloakAdmin = new KcAdminClient({
    //     baseUrl: process.env.KEYCLOAK_URL + "/auth",
    //     realmName: 'eventmanager-react'
    // });

    fastify.decorate('keycloakAdmin', keycloakAdmin)

    // await keycloakAdmin.setConfig({
    //     realmName: 'eventmanager-react',
    // });

    // let tokenSet = await client.grant({
    //     username: 'eugenio.ciaglia@gmail.com',
    //     password: 'Bl4dr4_2602',
    //     grant_type: 'password',
    //     // clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    //     // totp: '123456', // optional Time-based One-time Password if OTP is required in authentication flow
    // });

    // setInterval(async () => {
    //     const refreshToken = tokenSet.refresh_token;
    //     tokenSet = await client.refresh(refreshToken);
    //     keycloakAdmin.setAccessToken(tokenSet.access_token);
    // }, 58 * 1000); // 58 seconds
}

module.exports = fp(keycloakPlugin, { name: 'keycloak', dependencies: ['i18next'] })

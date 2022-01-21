"use strict";

module.exports = (keycloakAdmin) => {

    return {
        readAccountById: async (req, res) => {
            const { id } = req.params;
            try {
                await keycloakAdmin.auth({
                    username: process.env.KEYCLOAK_ADMIN_USERNAME,
                    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
                    grantType: 'password',
                    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID
                })
                await keycloakAdmin.setConfig({
                    realmName: process.env.KEYCLOAK_REALM,
                });
                const user = await keycloakAdmin.users.findOne({
                    id
                });
                if (user && user.id) {
                    return user
                } else throw new Error();
            } catch (e) {
                console.log(e);
                throw new Error();
            }
        },
        // createAccount: async (req, res) => {
        //     const { username, password } = req.body;

        //     try {
        //         // await keycloakAdmin.setConfig({
        //         //   realmName: 'eventmanager-react',
        //         // });
        //         await keycloakAdmin.auth({
        //             username: process.env.KEYCLOAK_ADMIN_USERNAME,
        //             password: process.env.KEYCLOAK_ADMIN_PASSWORD,
        //             grantType: 'password',
        //             clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID
        //         })
        //         await keycloakAdmin.setConfig({
        //             realmName: process.env.KEYCLOAK_REALM,
        //         });
        //         const createdUser = await keycloakAdmin.users.create({
        //             username,
        //             // enabled required to be true in order to send actions email
        //             emailVerified: true,
        //             enabled: true,
        //         });
        //         if (createdUser && createdUser.id) {
        //             return {
        //                 message: req.t("CREATE_ACCOUNT")
        //             }
        //         } else throw new Error();
        //     } catch (e) {
        //         console.log(e)
        //         throw new Error();
        //     }
        // }
    }
}
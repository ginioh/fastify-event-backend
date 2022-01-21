"use strict";

const nodemailer = require("nodemailer");
const fp = require("fastify-plugin");

const mailerPlugin = async (fastify, opts) => {
    
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
    });

    const sendMail = async (to, subject, text, html) => {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html
        })
    }

    fastify.decorate("sendMail", sendMail);
}

module.exports = fp(mailerPlugin)
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");

exports.compileAndSendEmail = (templateName, receiver, content, subject) => {
    ejs.renderFile(path.resolve(`node_modules/model-hook/Templates/${templateName}.ejs`), { receiver, ...content }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            this.sendEmail(receiver, subject, data)
        }
    });
}

exports.sendEmail = async (to, subject, html) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
        })
        const sent = await transport.sendMail({
            from: 'E-Commerce <no-reply@ecommerce.com>',
            to: to,
            subject: subject,
            html: html,
        });
    } catch (error) {
        console.log("Email send error", error)
    }
}
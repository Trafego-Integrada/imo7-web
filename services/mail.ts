import nodemailer from "nodemailer";

export const mail = nodemailer.createTransport({
    port: 465,
    host: "mail.imo7.com.br",
    auth: {
        user: "contato@imo7.com.br",
        pass: "7R7cq07=}fnY",
    },
    secure: true,
});

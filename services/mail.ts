import nodemailer from "nodemailer";

export const mail = nodemailer.createTransport({
    port: 465,
    host: "smtplw.com.br",
    auth: {
        user: "trafegoacesso",
        pass: "Trf5860l2CT1uk",
    },
    secure: true,
});

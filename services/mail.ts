import nodemailer from 'nodemailer'

const NODEMAILER_HOST = process.env.NODEMAILER_HOST!
const NODEMAILER_USER = process.env.NODEMAILER_USER!
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD!

export const mail = nodemailer.createTransport({
    port: 587,
    host: NODEMAILER_HOST,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD,
    },
    secure: false,
})

import nodemailer from "nodemailer";

export const mail = nodemailer.createTransport({
    port: 587,
    host: "smtp.email.sa-saopaulo-1.oci.oraclecloud.com",
    auth: {
        user: "ocid1.user.oc1..aaaaaaaafzgzqxcl6juczsarankioq5uokgfejtpspb3sjbch2ntbsysaova@ocid1.tenancy.oc1..aaaaaaaagzw4a3rjpjyjgolo4vfmjsp2i6zjqykoz5233xdwqa7uxdkuueya.jj.com",
        pass: "q&y6aM27iSBTz0K}vt-S",
    },
    secure: true,
});

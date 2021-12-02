import nextConnect from "next-connect";
import multiparty from "multiparty";

const multipart = nextConnect();

multipart.use(async (req, res, next) => {
    const form = new multiparty.Form();

    await form.parse(req, function (err, fields, files) {
        console.log(fields, files)
        req.body = fields;
        req.files = files;
        next();
    });
});

export default multipart;

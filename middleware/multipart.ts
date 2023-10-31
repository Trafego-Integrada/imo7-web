import formidable from "formidable";
const form = formidable({ multiples: true }); // multiples means req.files will be an array

export const multiparty = async (req, res, next) => {
    const contentType = req.headers["content-type"];
    if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
        console.log(req.body);
        form.parse(req, (err, fields, files) => {
            if (!err) {
                req.body = {};
                Object.entries(fields).map(
                    (item) => (req.body[item[0]] = item[1][0])
                ); // sets the body field in the request object
                req.files = files; // sets the files field in the request object
            }
            console.log(req.body);
            return next(); // continues to the next middleware or to the route
        });
    } else {
        return next();
    }
};

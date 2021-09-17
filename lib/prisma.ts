import { PrismaClient } from "@prisma/client";
import moment from "moment";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

prisma.$use(async (params, next) => {
    // Check incoming query type

    if (params.action == "delete") {
        // Delete queries
        // Change action to an update
        params.action = "update";
        params.args["data"] = { deleted: moment().format() };
    }
    if (params.action == "deleteMany") {
        // Delete many queries
        params.action = "updateMany";
        if (params.args.data != undefined) {
            params.args.data["deleted"] = true;
        } else {
            params.args["data"] = { deleted: moment().format() };
        }
    }
    if (params.action == "findFirst" || params.action == "findMany") {
        if (params.args.where != undefined) {
            params.args.where["deleted"] = null;
        } else {
            params.args["where"] = { deleted: null };
        }
    }
    return next(params);
});

export default prisma;

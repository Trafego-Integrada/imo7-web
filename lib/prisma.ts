import { PrismaClient } from "@prisma/client";
import moment from "moment";

interface CustomNodeJsGlobal extends NodeJS.Global {
    prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

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
        params.action = "update";
        params.args["data"] = { deletedAt: moment().format() };
    }
    if (params.action == "deleteMany") {
        // Delete many queries
        params.action = "updateMany";
        if (params.args.data != undefined) {
            params.args.data["deletedAt"] = moment().format();
        } else {
            params.args["data"] = { deletedAt: moment().format() };
        }
    }
    if (params.action == "findFirst" || params.action == "findMany") {
        // console.log(params)
        if (params.args.where && params.args.where["deletedAt"]) {
        } else if (params.args.where != undefined) {
            params.args.where["deletedAt"] = null;
        } else {
            params.args["where"] = { deletedAt: null };
        }
    }

    return next(params);
});

export default prisma;

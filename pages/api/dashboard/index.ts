import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    try {
        req.bo;
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handler;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type IResponse = {
  name: string,
  version: string,
  author: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    name: "API Simob",
    version: "0.0.1",
    author: "Gabriel Ferreira",
  });
}

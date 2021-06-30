import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import Auth from '../../../middleware/auth'

type NextApiRequestWithFoo = NextApiRequest & {
  foo: (bar: string) => void
}

const handler = (req: NextApiRequestWithFoo, res: NextApiResponse) => {
  try {
    res.send(req.user)
  } catch(error) {
    res.status(500).send({
      success: false,
      message: error.message
    })
  }
  
}

export default Auth(handler)
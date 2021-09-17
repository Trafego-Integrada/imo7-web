import { NextApiRequest, NextApiResponse } from 'next'
import Auth from '../../../middleware/Auth'

type NextApiRequestWithFoo = NextApiRequest & {
  user: any
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
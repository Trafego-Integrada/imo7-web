import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/prisma'

type NextApiRequestWithFoo = NextApiRequest & {
  foo: (bar: string) => void
}

const handler = async (req: NextApiRequestWithFoo, res: NextApiResponse) => {
  try {

    const { email, password } = req.body

    if(!email || !password)
      throw new Error("Informe e-mail e senha.");
    
    const user = await prisma.usuario.findUnique({
      where: {
        email: email
      },
      include: {
          perfil: true
      }
      
    })

    if(!user)
      throw new Error("Usuário desconhecido");
    
    if(!bcrypt.compareSync(password, user.senhaHash))
      throw new Error("Senha inválida");
    // @ts-expect-error 
    delete user.senhaHash;

    res.send({
      user: {...user, },
      token: jwt.sign({ 
        id: user.id
      }, process.env.TOKEN_SECRET as string, {
        expiresIn: '7d'
      })
    })
    
  } catch(error) {
    res.status(500).send({
      error: error.message
    })
  }
  
}

export default handler
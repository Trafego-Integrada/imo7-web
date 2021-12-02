import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

type NextApiRequestWithUser = NextApiRequest & {
    user: any
  }

const Auth = (handler:any) => {
    return async (req:NextApiRequestWithUser, res:NextApiResponse) => {
        try {
            const authHeader = req.headers['authorization']
        
            const token = authHeader && authHeader.split(' ')[1]

            if (token == null) throw new Error("Acesso negado.");
            

            const verify:any = jwt.verify(token, process.env.TOKEN_SECRET as string)
            
            const user = await prisma.usuario.findUnique({
                where: {
                    id: verify.id
                },
                include: {
                    perfil: true
                }
            })

            if (!user) throw new Error("Usuário não encontrado");
            
            // @ts-expect-error 
            delete user?.senhaHash;

            req.user = user

            return handler(req, res)

        } catch (error) {
            res.status(401).send({
                error: error.message
            })
        }
        
    }
}
  
export default Auth
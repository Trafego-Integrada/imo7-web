import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const Auth = handler => {
    return async (req, res) => {
        try {
            const authHeader = req.headers['authorization']
        
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).send()

            const verify = jwt.verify(token, process.env.TOKEN_SECRET as string)
            
            const user = await prisma.usuario.findUnique({
                where: {
                    id: verify.id
                }
            })

            if (!user) throw new Error("Usuário não encontrado");
            
            delete user?.senhaHash;

            req.user = user

            return handler(req, res)

        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
        
    }
}
  
export default Auth
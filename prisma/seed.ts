import prisma from "../lib/prisma"
import bcrypt from 'bcryptjs'
async function main() {
  const inquilino = await prisma.usuario.upsert({
    where: { email: 'inquilino@teste.com' },
    update: {},
    create: {
        nome: 'Inquilino da Silva',
        email: 'inquilino@teste.com',
        senhaHash: bcrypt.hashSync('100senha', 10),
        perfil: {
          create: {
            documento: '11111111111'
          }
        }
    },
  })

  const proprietario = await prisma.usuario.upsert({
    where: { email: 'proprietario@teste.com' },
    update: {},
    create: {
      nome: 'Proprietário da Silva',
      email: 'proprietario@teste.com',
      senhaHash: bcrypt.hashSync('100senha', 10),
      perfil: {
        create: {
          documento: '22222222222'
        }
      }
  },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
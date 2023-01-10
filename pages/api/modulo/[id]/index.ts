import nextConnect from "next-connect";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const handle = nextConnect();

handle.get(async (req, res) => {
  try {
    const { id } = req.query;
    const data = await prisma.mOBTBP06_USUARIO_CONTA.findUnique({
      where: {
        NU_USUARIO: Number(id)
      },
      include: {
        MOBTBD20_PERFIL: true,
        MOBTBP12_USUARIO_MODULO: {
          include: {
            MOBTBD15_MENU: true
          }
        },
        MOBTBP13_USUARIO_PERMISSAO: {
          include: {
            MOBTBD21_PERMISSAO: true
          }
        }
      }
    });

    res.send({
      success: true,
      data: {
        nome: data?.NO_USUARIO,
        email: data?.DE_EMAIL_USUARIO,
        foto: data?.DE_URL_FOTO_USUARIO,
        whatsapp: data?.CO_TELEFONE_WHATSAPP,
        telefone: data?.CO_TELEFONE,
        perfil: data?.NU_PERFIL_D20,
        permissoes: data?.MOBTBP13_USUARIO_PERMISSAO.map((i) => i.p),
        modulos: data?.MOBTBP12_USUARIO_MODULO.map((i) => i.CO_MODULO)
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

handle.post(async (req, res) => {
  try {
    const { id } = req.query;
    const { nome, email, senha, confirmarSenha } = req.body;

    let atualizarSenha = {};
    if (senha && confirmarSenha) {
      atualizarSenha = {
        senha: bcrypt.hashSync(senha, 10)
      };
    }
    const data = await prisma.usuario.update({
      where: {
        id: Number(id)
      },
      data: {
        nome,
        email,
        ...atualizarSenha
      }
    });

    res.send({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

export default handle;

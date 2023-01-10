import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.usuario.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            cargos: true,
            boletos: true,
            conta: true,
            contratosFiador: {
                include: {
                    proprietarios: true,
                    inquilinos: true,
                    imovel: true,
                },
            },
            contratosInquilino: {
                include: {
                    proprietarios: true,
                    imovel: true,
                },
            },
            contratosProprietario: {
                include: {
                    inquilinos: true,
                    imovel: true,
                },
            },
            imobiliaria: true,
            imoveis: true,
            permissoes: true,
            modulos: true,
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    res.send({
        ...data,
        cargos: data?.cargos.map((item) => item.codigo),
        modulos: data?.modulos.map((item) => item.codigo),
        permissoes: data?.permissoes.map((item) => item.codigo),
    });
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const {
        nome,
        email,
        documento,
        celular,
        password,
        confirmPassword,
        telefone,
        profissao,
        cargos,
        modulos,
        permissoes,
    } = req.body;

    let atualizarSenha = {};
    if (password && confirmPassword) {
        if (password != confirmPassword) {
            res.status(401).send("As senhas não conferem");
        }
        atualizarSenha = {
            password: bcrypt.hashSync(password, 10),
        };
    }
    const data = await prisma.usuario.update({
        where: {
            id: Number(id),
        },
        data: {
            nome,
            email,
            celular,
            telefone,
            profissao,
            modulos:
                modulos.length > 0
                    ? {
                          connect: modulos.map((m) => {
                              return {
                                  codigo: m,
                              };
                          }),
                      }
                    : {},
            cargos:
                cargos.length > 0
                    ? {
                          connect: cargos.map((m) => {
                              return {
                                  codigo: m,
                              };
                          }),
                      }
                    : {},
            permissoes:
                permissoes.length > 0
                    ? {
                          connect: permissoes.map((m) => {
                              return {
                                  codigo: m,
                              };
                          }),
                      }
                    : {},
            // permissoes:
            //     permissoes.length > 0
            //         ? {
            //               createMany: {
            //                   data: permissoes.map((m) => {
            //                       return {
            //                           codigo: m,
            //                       };
            //                   }),
            //                   skipDuplicates: true,
            //               },
            //           }
            //         : {},
            ...atualizarSenha,
        },
    });
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.usuario.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    await prisma.usuario.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;

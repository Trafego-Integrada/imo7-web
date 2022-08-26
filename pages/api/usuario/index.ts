import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        const {
            filtro,
            nome,
            documento,
            telefone,
            pagina,
            linhas,
            inquilino,
            proprietario,
            adminImobiliaria,
            admConta,
            adm,
        } = req.query;

        let filtroQuery = {};

        if (filtro) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        nome: {
                            contains: filtro,
                        },
                    },
                ],
            };
        }
        if (nome) {
            filtroQuery = {
                ...filtroQuery,
                nome: {
                    contains: nome,
                },
            };
        }
        if (telefone) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        telefone: {
                            contains: telefone,
                        },
                    },
                    {
                        celular: {
                            contains: telefone,
                        },
                    },
                ],
            };
        }
        if (documento) {
            filtroQuery = {
                ...filtroQuery,
                docmento: {
                    contains: documento,
                },
            };
        }
        if (inquilino) {
            filtroQuery = {
                ...filtroQuery,
                contratosInquilino: {
                    some: {},
                },
            };
        }
        if (proprietario) {
            filtroQuery = {
                ...filtroQuery,
                contratosProprietario: {
                    some: {},
                },
            };
        }
        if (adm) {
            filtroQuery = {
                ...filtroQuery,
                cargos: {
                    some: {
                        nome: "adm",
                    },
                },
            };
        }
        if (admConta) {
            filtroQuery = {
                ...filtroQuery,
                conta: {
                    some: {
                        id: req.user.conta?.id,
                    },
                },
                cargos: {
                    some: {
                        nome: "conta",
                    },
                },
            };
        }
        if (adminImobiliaria) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliaria?.id,
                },
                cargos: {
                    some: {
                        nome: "imobiliaria",
                    },
                },
            };
        }

        let paginacao = {};
        if (pagina && linhas) {
            paginacao = {
                take: Number(linhas),
                skip:
                    pagina && pagina > 1
                        ? Number(pagina) * Number(linhas) - Number(linhas)
                        : 0,
            };
        }

        const data = await prisma.usuario.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
        });
        const total = await prisma.usuario.count({
            where: {
                ...filtroQuery,
            },
        });
        res.send({
            success: true,
            data: {
                total,
                data,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
            nome,
            email,
            documento,
            imobiliariaId,
            senha,
            profissao,
            endereco,
            cidade,
            bairro,
            cep,
            estado,
            celular,
            telefone,
        } = req.body;

        const usuarioExiste = await prisma.usuario.findFirst({
            where: {
                OR: [
                    {
                        email,
                    },
                    { documento },
                ],
            },
        });

        if (usuarioExiste) {
            res.send(usuarioExiste);
        } else {
            const data = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    documento,
                    senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                    imobiliaria: {
                        connect: {
                            id: req.user.imobiliaria?.id,
                        },
                    },
                    cargos: {
                        connect: {
                            id: 2,
                        },
                    },
                },
            });

            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;

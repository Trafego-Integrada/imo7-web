import { checkAuth } from "@/middleware/checkAuth";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        //console.log(req.headers);
        const { imobiliaria } = req.headers;
        let {
            filtro,
            nome,
            documento,
            telefone,
            pagina,
            linhas,
            inquilino,
            proprietario,
            admImobiliaria,
            admConta,
            adm,
            contaId,
            imobiliariaId,
            status,
        } = req.query;
        //console.log(req.query);
        let filtroQuery = {};
        imobiliariaId = req.user.imobiliariaId
            ? req.user.imobiliariaId
            : Number(imobiliariaId);
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
        if (contaId) {
            filtroQuery = {
                ...filtroQuery,
                conta: {
                    some: {
                        id: Number(contaId),
                    },
                },
            };
        }
        if (imobiliariaId) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId),
                },
            };
        }

        if (adm == "true") {
            filtroQuery = {
                ...filtroQuery,
                cargos: {
                    some: {
                        nome: "adm",
                    },
                },
            };
        } else if (admConta == "true") {
            filtroQuery = {
                ...filtroQuery,
                cargos: {
                    some: {
                        nome: "conta",
                    },
                },
            };
        } else if (admImobiliaria == "true") {
            filtroQuery = {
                ...filtroQuery,
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
        if (imobiliaria != "null" && imobiliaria) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: { url: imobiliaria },
            };
        }
        if ((status == "true" || status == "false") && status != null) {
            filtroQuery = {
                ...filtroQuery,
                status: JSON.parse(status),
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
                deletedAt: null,
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
            contaId,
            senha,
            profissao,
            endereco,
            cidade,
            bairro,
            cep,
            estado,
            celular,
            telefone,
            status,
        } = req.body;

        const usuarioExiste = await prisma.usuario.findFirst({
            where: {
                OR: [
                    {
                        email,
                    },
                ],
                imobiliariaId: imobiliariaId,
                cargos: {
                    some: {
                        codigo: "imobiliaria",
                    },
                },
            },
        });
        //console.log(contaId);
        if (!contaId && !imobiliariaId) {
            //console.log(1);
            if (usuarioExiste) {
                const data = await prisma.usuario.update({
                    where: {
                        id: usuarioExiste.id,
                    },
                    data: {
                        nome,
                        email,
                        documento,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        status,
                        cargos: {
                            connect: {
                                codigo: "adm",
                            },
                        },
                    },
                });
                res.send(data);
            } else {
                const data = await prisma.usuario.create({
                    data: {
                        nome,
                        email,
                        documento,
                        status,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        cargos: {
                            connect: {
                                codigo: "adm",
                            },
                        },
                    },
                });
                res.send(data);
            }
        } else if (contaId) {
            //console.log(2);
            if (usuarioExiste) {
                const data = await prisma.usuario.update({
                    where: {
                        id: usuarioExiste.id,
                    },
                    data: {
                        nome,
                        email,
                        documento,
                        status,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        conta: {
                            connect: {
                                id: Number(contaId),
                            },
                        },
                        cargos: {
                            connect: {
                                codigo: "conta",
                            },
                        },
                    },
                });

                res.send(data);
            } else {
                const data = await prisma.usuario.create({
                    data: {
                        nome,
                        email,
                        documento,
                        status,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        conta: {
                            connect: {
                                id: Number(contaId),
                            },
                        },
                        cargos: {
                            connect: {
                                codigo: "conta",
                            },
                        },
                    },
                });

                res.send(data);
            }
        } else if (imobiliariaId) {
            //console.log(3);
            if (usuarioExiste) {
                const data = await prisma.usuario.update({
                    where: {
                        id: usuarioExiste.id,
                    },
                    data: {
                        nome,
                        email,
                        documento,
                        status,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        imobiliaria: {
                            connect: {
                                id: Number(imobiliariaId),
                            },
                        },
                        cargos: {
                            connect: {
                                codigo: "imobiliaria",
                            },
                        },
                    },
                });

                res.send(data);
            } else {
                const data = await prisma.usuario.create({
                    data: {
                        nome,
                        email,
                        documento,
                        senhaHash: senha ? bcrypt.hashSync(senha, 10) : null,
                        imobiliaria: {
                            connect: {
                                id: Number(imobiliariaId),
                            },
                        },
                        cargos: {
                            connect: {
                                codigo: "imobiliaria",
                            },
                        },
                    },
                });

                res.send(data);
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);

        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.usuario.deleteMany({
            where: {
                id: {
                    in: arrayIds,
                },
            },
        });
        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error?.message,
        });
    }
});
export default handle;

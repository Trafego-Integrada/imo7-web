import { checkAuth } from "@/middleware/checkAuth";
import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    try {
        let {
            query,
            codigo,
            inquilino,
            dataInicio,
            vencimento,
            status,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            pagina,
            linhas,
            contratoId,
            createdAt,
            imobiliariaId,
        } = req.query;
        imobiliariaId = req.user.imobiliariaId
            ? req.user.imobiliariaId
            : Number(imobiliariaId);
        let filtroQuery: Prisma.BoletoWhereInput = {};
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        titulo: {
                            contains: query,
                        },
                    },
                    {
                        contrato: {
                            codigo: {
                                contains: query,
                            },
                        },
                    },
                    {
                        contrato: {
                            inquilinos: {
                                every: {
                                    nome: {
                                        contains: query,
                                    },
                                },
                            },
                        },
                    },
                    {
                        contrato: {
                            imovel: {
                                endereco: {
                                    contains: query,
                                },
                            },
                        },
                    },
                ],
            };
        }
        if (contratoId) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    id: Number(contratoId),
                },
            };
        }
        if (codigo) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    codigo: {
                        contains: codigo,
                    },
                },
            };
        }
        if (createdAt) {
            filtroQuery = {
                ...filtroQuery,
                createdAt: {
                    gte: moment(createdAt).startOf("D").format(),
                    lt: moment(createdAt).endOf("D").format(),
                },
            };
        }
        if (inquilino) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    inquilinos: {
                        every: {
                            nome: {
                                contains: inquilino,
                            },
                        },
                    },
                },
            };
        }
        if (endereco) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        endereco: {
                            contains: endereco,
                        },
                    },
                },
            };
        }
        if (numero) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        numero: {
                            contains: numero,
                        },
                    },
                },
            };
        }
        if (bairro) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        bairro: {
                            contains: bairro,
                        },
                    },
                },
            };
        }
        if (cidade) {
            filtroQuery = {
                ...filtroQuery,
                contrato: {
                    imovel: {
                        cidade: {
                            contains: cidade,
                        },
                    },
                },
            };
        }
        if (status) {
            filtroQuery = {
                ...filtroQuery,
                status,
            };
        }
        let paginacao = {};
        if (imobiliariaId) {
            filtroQuery = {
                ...filtroQuery,
                imobiliaria: {
                    id: Number(imobiliariaId),
                },
            };
        }
        if (pagina && linhas) {
            paginacao = {
                take: Number(linhas),
                skip:
                    pagina && pagina > 1
                        ? Number(pagina) * Number(linhas) - Number(linhas)
                        : 0,
            };
        }

        const data = await prisma.chamado.findMany({
            where: {
                ...filtroQuery,
            },
            ...paginacao,
            include: {
                criador: true,
                interacoes: true,

                contrato: {
                    include: {
                        imovel: true,
                    },
                },
                assunto: {
                    include: { departamento: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const total = await prisma.chamado.count({
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
        //console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

handle.post(async (req, res) => {
    try {
        const {
            assuntoId,
            titulo,
            mensagem,
            contratoId,
            participantes,
            bairroImovel,
            cepImovel,
            cidadeImovel,
            codigoContrato,
            complementoImovel,
            enderecoImovel,
            numeroImovel,
            estadoImovel,
            codigoImovel,
        } = req.body;

        const data = await prisma.chamado.create({
            data: {
                assunto: {
                    connect: {
                        id: Number(assuntoId),
                    },
                },
                titulo,

                criador: {
                    connect: {
                        id: req.user.id,
                    },
                },
                contrato: contratoId
                    ? {
                          connect: {
                              id: Number(contratoId),
                          },
                      }
                    : {},
                conta: {
                    connect: {
                        id: req.user?.imobiliaria?.contaId,
                    },
                },
                imobiliaria: {
                    connect: {
                        id: req.user?.imobiliariaId,
                    },
                },
                responsavel: {
                    connect: {
                        id: req.user.id,
                    },
                },
                codigoImovel,
                bairroImovel,
                cepImovel,
                cidadeImovel,
                codigoContrato,
                complementoImovel,
                enderecoImovel,
                numeroImovel,
                estadoImovel,
            },
        });
        if (!participantes && mensagem) {
            await prisma.conversaChamado.create({
                data: {
                    chamado: {
                        connect: {
                            id: data.id,
                        },
                    },
                    criador: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                    participantes: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                    interacoes: {
                        create: {
                            chamado: {
                                connect: {
                                    id: data.id,
                                },
                            },
                            mensagem,
                            usuario: {
                                connect: {
                                    id: req.user.id,
                                },
                            },
                        },
                    },
                },
            });
        }
        if (participantes) {
            const conversa = await prisma.conversaChamado.create({
                data: {
                    chamado: {
                        connect: {
                            id: data.id,
                        },
                    },
                    criador: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                    participantes: participantes
                        ? {
                              connect: participantes.map((item) => {
                                  return {
                                      id: item.id,
                                  };
                              }),
                          }
                        : {
                              connect: {
                                  id: req.user.id,
                              },
                          },
                    interacoes: {
                        create: {
                            chamado: {
                                connect: {
                                    id: data.id,
                                },
                            },
                            mensagem,
                            usuario: {
                                connect: {
                                    id: req.user.id,
                                },
                            },
                        },
                    },
                },
            });
        }

        await prisma.historicoChamado.create({
            data: {
                chamado: {
                    connect: {
                        id: data.id,
                    },
                },
                usuario: {
                    connect: {
                        id: req.user.id,
                    },
                },
                descricao: `${req.user.nome} abriu o chamado`,
            },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

export default handle;

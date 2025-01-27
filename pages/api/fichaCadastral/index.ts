import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import { Prisma } from "@prisma/client";
import moment from "moment";
import nextConnect from "next-connect";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

async function buscarPreenchimentos(req, res) {
    try {
        const { id } = req.query;

        const data = await prisma.fichaCadastral.findUnique({
            where: {
                id,
            },
            select: {
                preenchimento: {
                    include: {
                        campo: true,
                        validacaoFacial: true,
                    },
                },
            },
        });

        res.send(data);
    } catch (error) {
        res.status(500).send({
            error,
            message: error.message,
        });
    }
}

handle.get(async (req, res) => {
    try {
        let {
            tipoFicha,
            query,
            createdAt,
            updatedAt,
            status,
            responsaveis,
            identificacao,
            deletedAt,
            codigo,
            importada,
            pagina,
            linhas,
            processoId,
            action,
        } = req.query;

        if (action === "buscarPreenchimentos") {
            return buscarPreenchimentos(req, res);
        }

        let filtroQuery: Prisma.FichaCadastralWhereInput = { AND: [] };

        if (tipoFicha) {
            filtroQuery = {
                ...filtroQuery,
            };
        }
        if (deletedAt) {
            filtroQuery = {
                ...filtroQuery,
                deletedAt: {
                    not: null,
                },
            };
        } else {
            filtroQuery = {
                ...filtroQuery,
                deletedAt: null,
            };
        }

        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        nome: {
                            contains: query,
                        },
                    },
                    {
                        descricao: {
                            contains: query,
                        },
                    },
                    {
                        documento: {
                            contains: query,
                        },
                    },
                    {
                        telefone: {
                            contains: query,
                        },
                    },
                    {
                        email: {
                            contains: query,
                        },
                    },
                    {
                        modelo: {
                            nome: {
                                contains: query,
                            },
                        },
                    },
                ],
            };
        }
        if (identificacao) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        OR: [
                            {
                                nome: {
                                    contains: identificacao,
                                },
                            },
                            {
                                documento: {
                                    contains: identificacao,
                                },
                            },
                            {
                                telefone: {
                                    contains: identificacao,
                                },
                            },
                            {
                                email: {
                                    contains: identificacao,
                                },
                            },
                        ],
                    },
                ],
            };
        }
        if (codigo) {
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        codigo: Number(codigo),
                    },
                ],
            };
        }
        if (createdAt) {
            createdAt = JSON.parse(createdAt);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
                            gte: createdAt[0]
                                ? moment(createdAt[0]).startOf("d").format()
                                : null,
                            lte: createdAt[1]
                                ? moment(createdAt[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (updatedAt) {
            updatedAt = JSON.parse(updatedAt);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        updatedAt: {
                            gte: updatedAt[0]
                                ? moment(updatedAt[0]).startOf("d").format()
                                : null,
                            lte: updatedAt[1]
                                ? moment(updatedAt[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
            };
        }
        if (status) {
            status = JSON.parse(status);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        status: {
                            in: status,
                        },
                    },
                ],
            };
        }
        if (responsaveis) {
            responsaveis = JSON.parse(responsaveis);
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        responsavel: {
                            id: {
                                in: responsaveis.map((i) => i.id),
                            },
                        },
                    },
                ],
            };
        }
        if (importada && importada === "0") {
            filtroQuery = {
                ...filtroQuery,
                importadaJb: false,
            };
        }
        if (importada && importada === "1") {
            filtroQuery = {
                ...filtroQuery,
                importadaJb: true,
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
        if (
            !req.user.permissoes.includes("imobiliaria.fichas.visualizarTodas")
        ) {
            filtroQuery = {
                ...filtroQuery,
                responsavelId: req.user.id,
            };
        }
        if (processoId) {
            filtroQuery = {
                ...filtroQuery,
                processoId,
            };
        }
        const data = await prisma.fichaCadastral.findMany({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliariaId,
                },
            },
            include: {
                preenchimento: {
                    include: {
                        campo: true,
                        ficha: true,
                    },
                },
                modelo: true,
                responsavel: true,
            },
            ...paginacao,
        });

        const count = await prisma.fichaCadastral.count({
            where: {
                ...filtroQuery,
                imobiliaria: {
                    id: req.user.imobiliariaId,
                },
            },
        });

        res.send({ data, total: count });
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
            modelo,
            descricao,
            nome,
            documento,
            email,
            telefone,
            responsavel,
            imovel,
            codigoImovel,
            cepImovel,
            enderecoImovel,
            numeroImovel,
            complementoImovel,
            bairroImovel,
            cidadeImovel,
            estadoImovel,
            processoId,
            responsavelId,
            imovelId,
            observacoes,
            motivoReprovacaoId,
            motivoReprovacao,
        } = req.body;

        let dataPreenchimento = {};
        if (responsavel) {
            dataPreenchimento = {
                ...dataPreenchimento,
                responsavel: {
                    connect: {
                        id: Number(responsavel.id),
                    },
                },
            };
        }
        if (imovel) {
            dataPreenchimento = {
                ...dataPreenchimento,
                imovel: {
                    connect: {
                        id: Number(imovel.id),
                    },
                },
            };
        }
        let ultimoCodigo = 1;
        const ultimaFicha = await prisma.fichaCadastral.findFirst({
            where: {
                imobiliariaId: req.user.imobiliariaId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (ultimaFicha?.codigo) {
            ultimoCodigo = ultimaFicha.codigo + 1;
        }

        const data = await prisma.fichaCadastral.create({
            data: {
                codigo: ultimoCodigo,
                modelo: {
                    connect: {
                        id: modelo.id,
                    },
                },
                descricao,
                nome,
                documento,
                email,
                telefone,
                status: "aguardando",
                codigoImovel,
                cepImovel,
                enderecoImovel,
                numeroImovel,
                complementoImovel,
                bairroImovel,
                cidadeImovel,
                estadoImovel,
                observacoes,
                motivoReprovacao,
                motivoReprovacaoFicha: motivoReprovacaoId
                    ? {
                          connect: {
                              id: motivoReprovacaoId,
                          },
                      }
                    : {},
                imobiliaria: {
                    connect: {
                        id: req.user.imobiliariaId,
                    },
                },
                Processo: processoId
                    ? {
                          connect: {
                              id: processoId,
                          },
                      }
                    : {},
                imovel: imovelId
                    ? {
                          connect: {
                              id: imovelId,
                          },
                      }
                    : {},
                responsavel: responsavelId
                    ? {
                          connect: {
                              id: responsavelId,
                          },
                      }
                    : {},
                ...dataPreenchimento,
            },
        });
        await prisma.historico.create({
            data: {
                descricao: "cadastrou a ficha",
                tabela: "FichaCadastral",
                tabelaId: data.id,
                usuarioId: req.user.id,
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

handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);

        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.fichaCadastral.deleteMany({
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

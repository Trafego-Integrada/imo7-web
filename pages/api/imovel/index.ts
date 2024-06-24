import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
import { Prisma } from "@prisma/client";
import moment from "moment";

const handle = nextConnect();

handle.use(cors);
handle.use(checkAuth);

handle.get(async (req, res) => {
    try {
        let {
            query,
            pagina,
            linhas,
            endereco,
            numero,
            bairro,
            cidade,
            estado,
            codigo,
            codigoImovel,
            dataCriacao,
            noIncludes,
            imovelId
        } = req.query;

        let filtroQuery: Prisma.ImovelWhereInput = {};
        if (query) {
            filtroQuery = {
                ...filtroQuery,
                OR: [
                    {
                        tipo: {
                            contains: query
                        }
                    },
                    {
                        descricao: {
                            contains: query
                        }
                    },
                    {
                        codigo: {
                            contains: query,
                        },
                    },
                    {
                        cep: {
                            contains: query,
                        },
                    },
                    {
                        endereco: {
                            contains: query,
                        },
                    },
                    {
                        bairro: {
                            contains: query,
                        },
                    },
                    {
                        cidade: {
                            contains: query,
                        },
                    },
                    {
                        estado: {
                            contains: query,
                        },
                    },
                    {
                        proprietarios: {
                            some: {
                                proprietario: {
                                    nome: {
                                        contains: query,
                                    },
                                },
                            },
                        },
                    },
                    {
                        contrato: {
                            codigo: {
                                contains: query,
                            },
                        },
                    },
                ],
            };
        }

        if (endereco) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            endereco: {
                                contains: endereco,
                            },
                        },
                    },
                ],
            };
        }
        // if (
        //     !req.user.permissoes.includes(
        //         "imobiliaria.processos.visualizarTodos"
        //     )
        // ) {
        //     filtroQuery = {
        //         ...filtroQuery,

        //         responsavelId: req.user.id,
        //     };
        // }
        if (numero) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            numero: {
                                contains: numero,
                            },
                        },
                    },
                ],
            };
        }
        if (bairro) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            bairro: {
                                contains: bairro,
                            },
                        },
                    },
                ],
            };
        }
        if (cidade) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            cidade: {
                                contains: cidade,
                            },
                        },
                    },
                ],
            };
        }
        if (estado) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            estado: {
                                contains: estado,
                            },
                        },
                    },
                ],
            };
        }
        if (codigo) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        codigo: {
                            contains: codigo,
                        },
                    },
                ],
            };
        }
        if (codigoImovel) {
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        imovel: {
                            codigo: {
                                contains: codigoImovel,
                            },
                        },
                    },
                ],
            };
        }
        if (dataCriacao && dataCriacao[0]) {
            dataCriacao = JSON.parse(dataCriacao);
            if (!filtroQuery.AND) {
                filtroQuery = {
                    ...filtroQuery,
                    AND: [],
                };
            }
            filtroQuery = {
                ...filtroQuery,
                AND: [
                    ...filtroQuery.AND,
                    {
                        createdAt: {
                            gte: dataCriacao[0]
                                ? moment(dataCriacao[0]).startOf("d").format()
                                : null,
                            lte: dataCriacao[1]
                                ? moment(dataCriacao[1]).endOf("d").format()
                                : null,
                        },
                    },
                ],
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
        } else if (linhas) {
            paginacao = {
                take: Number(linhas),
            };
        }

        const data = await prisma.imovel.findMany({
            where: {
                ...filtroQuery,
                imobiliariaId: req.user?.imobiliariaId,
            },
            skip: paginacao?.skip ?? 0,
            take: paginacao?.take ?? 20,
            include: {
                contrato: noIncludes ? false : true,
                FichaCadastral: noIncludes ? false : true,
                Processo: noIncludes ? false : true,
                proprietarios: noIncludes
                    ? false
                    : {
                          include: {
                              proprietario: true,
                          },
                      },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        let imovel = null
        if(imovelId && !data.find(({ id }) => id === Number(imovelId))){
            imovel = await prisma.imovel.findUnique({
                where: {
                    id: Number(imovelId)
                }
            })
        }

        const total = await prisma.imovel.count({
            where: {
                ...filtroQuery,
                imobiliariaId: req.user?.imobiliariaId,
            },
        });
        
        res.send({
            data: {
                total: imovel ? total + 1 : total,
                data: imovel ? [...data, {...imovel}] : data,
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
    const {
        aceitaPet,
        areaTotal,
        areaUtil,
        autorizado,
        bairro,
        banheiros,
        cep,
        cidade,
        caracteristicas,
        codigo,
        complemento,
        cozinhas,
        descricao,
        endereco,
        estado,
        exclusividade,
        garagens,
        lavabos,
        mobiliado,
        numero,
        numeroAgua,
        numeroIptu,
        piscinas,
        placa,
        destaque,
        numeroEnergia,
        pontoReferencia,
        quartos,
        salas,
        suites,
        proprietarios,
        terreno,
        tipo,
        valorAluguel,
        valorCondominio,
        valorIPTU,
        valorVenda,
        valorSeguro,
        varandas,
    } = req.body;

    const conta = await prisma.imovel.create({
        data: {
            aceitaPet,
            areaTotal,
            areaUtil,
            autorizado,
            bairro,
            banheiros,
            cep,
            cidade,
            caracteristicas,
            codigo,
            complemento,
            imobiliaria: {
                connect: {
                    id: req.user.imobiliariaId,
                },
            },
            cozinhas,
            descricao,
            endereco,
            estado,
            exclusividade,
            garagens,
            lavabos,
            mobiliado,
            numero,
            numeroAgua,
            numeroIptu,
            piscinas,
            placa,
            destaque,
            numeroEnergia,
            pontoReferencia,
            quartos,
            salas,
            suites,
            proprietarios,
            terreno,
            tipo,
            valorAluguel: valorAluguel
                ? Number(valorAluguel.replace(",", "."))
                : null,
            valorCondominio: valorCondominio
                ? Number(valorCondominio.replace(",", "."))
                : null,
            valorIPTU: valorIPTU ? Number(valorIPTU.replace(",", ".")) : null,
            valorVenda: valorVenda
                ? Number(valorVenda.replace(",", "."))
                : null,
            valorSeguro: valorSeguro
                ? Number(valorSeguro.replace(",", "."))
                : null,
            varandas,
        },
    });

    res.send(conta);
});

handle.delete(async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);
        //console.log(arrayIds, ids);
        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.imovel.deleteMany({
            where: {
                id: {
                    in: arrayIds.map((i) => Number(i)),
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

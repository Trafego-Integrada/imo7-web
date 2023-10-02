import moment from "moment";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/middleware/checkAuth";
import { apiNetrinService } from "@/services/apiNetrin";
import { cors } from "@/middleware/cors";
import { removerCaracteresEspeciais } from "@/helpers/helpers";
import { Prisma } from "@prisma/client";

const handle = nextConnect<NextApiRequest, NextApiResponse>();
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { processoId, fichaCadastralId } = req.query;
    console.log(req.query);

    let filtro: Prisma.ConsultaNetrinWhereInput = {};

    if (processoId) {
        filtro = {
            ...filtro,
            processoId,
        };
    }

    if (fichaCadastralId) {
        filtro = {
            ...filtro,
            fichaCadastralId,
        };
    }
    const data = await prisma.consultaNetrin.findMany({
        where: {
            imobiliariaId: req.user.imobiliariaId,
            ...filtro,
        },
    });

    res.send(data);
});
handle.post(async (req, res) => {
    try {
        const { tipoConsulta, requisicao, processoId, fichaCadastralId } =
            req.body;

        let requisicaoBody = {
            ...requisicao,
        };

        if (tipoConsulta == "processos_pf") {
            if (!requisicao.cpf) {
                return res
                    .status(400)
                    .send({ message: "Informe um CPF válido" });
            } else {
                requisicaoBody = {
                    s: "processos-cpf",
                    cpf: removerCaracteresEspeciais(requisicao.cpf),
                };
            }
        } else if (tipoConsulta == "processos_pj") {
            if (!requisicao.cnpj) {
                return res
                    .status(400)
                    .send({ message: "Informe um CNPJ válido" });
            } else {
                requisicaoBody = {
                    s: "processos-cnpj",
                    cnpj: removerCaracteresEspeciais(requisicao.cnpj),
                };
            }
        }

        // Consulta Netrin
        const retornoNetrin = await apiNetrinService().consultaComposta(
            requisicaoBody
        );
        console.log(retornoNetrin);
        if (!retornoNetrin) {
            res.status(400).json({
                success: false,
                errorCode: "R01",
                message: "Recibo não encontrado",
            });
        }
        const data = await prisma.consultaNetrin.create({
            data: {
                tipoConsulta,
                requisicao,
                retorno: retornoNetrin,
                imobiliaria: {
                    connect: {
                        id: req.user?.imobiliariaId,
                    },
                },
                processo: processoId
                    ? {
                          connect: {
                              id: processoId,
                          },
                      }
                    : {},
                fichaCadastral: fichaCadastralId
                    ? {
                          connect: {
                              id: fichaCadastralId,
                          },
                      }
                    : {},
            },
        });

        res.send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message, error });
    }
});

export default handle;

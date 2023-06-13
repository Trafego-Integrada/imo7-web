import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import moment from "moment";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.tarefa.findFirst({
        where: {
            id,
        },
        include: {
            departamento: true,
            membros: true,
            responsaveis: true,
            tags: true,
        },
    });

    res.send(data);
});

handle.post(async (req, res) => {
    const { id } = req.query;
    const {
        dataEntrega,
        dataVencimento,
        departamento,
        descricao,
        prioridade,
        titulo,
        status,
        membros,
        responsaveis,
        tags,
        contrato,
        imovel,
    } = req.body;

    const data = await prisma.tarefa.update({
        where: {
            id,
        },
        data: {
            dataEntrega: dataEntrega ? moment(dataEntrega).format() : null,
            dataVencimento: dataVencimento
                ? moment(dataVencimento).format()
                : null,
            departamento: departamento
                ? {
                      connect: {
                          id: departamento.id,
                      },
                  }
                : {},
            descricao,
            prioridade,
            titulo,
            status,
            membros:
                membros.length > 0
                    ? {
                          set: membros.map((item) => {
                              return {
                                  id: item.id,
                              };
                          }),
                      }
                    : { set: [] },
            responsaveis:
                responsaveis.length > 0
                    ? {
                          set: responsaveis.map((item) => {
                              return {
                                  id: item.id,
                              };
                          }),
                      }
                    : { set: [] },
            tags: {
                set:
                    tags.length > 0
                        ? tags
                              .filter((e) => e.id)
                              .map((tag) => {
                                  return {
                                      id: tag.id,
                                  };
                              })
                        : {},
                create:
                    tags.length > 0
                        ? tags
                              .filter((e) => e.label)
                              .map((tag) => {
                                  return {
                                      nome: tag.label,
                                      imobiliariaId: req.user.imobiliariaId,
                                  };
                              })
                        : {},
                contrato: contrato
                    ? {
                          connect: {
                              id: Number(contrato.id),
                          },
                      }
                    : { disconnect: {} },
                imovel: imovel
                    ? {
                          connect: {
                              id: Number(imovel.id),
                          },
                      }
                    : { disconnect: {} },
            },
        },
    });
    if (data.chamadoId) {
        await prisma.historicoChamado.create({
            data: {
                descricao: "Atualizou a tarefa # " + data.id,
                chamado: {
                    connect: {
                        id: Number(data.chamadoId),
                    },
                },
                usuario: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
    }
    res.send(data);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.tarefa.findFirst({
        where: {
            id,
        },
    });
    if (!data) {
        res.status(400).json({
            success: false,
            errorCode: "U01",
            message: "Usuário não encontrado",
        });
    }
    await prisma.tarefa.delete({
        where: { id },
    });
    res.send();
});

export default handle;

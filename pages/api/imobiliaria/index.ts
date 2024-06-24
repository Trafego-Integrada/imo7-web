import prisma from "@/lib/prisma";
import { checkAuth } from "@/middleware/checkAuth";
import { cors } from "@/middleware/cors";
import bcrypt from "bcryptjs";
import nextConnect from "next-connect";
const handle = nextConnect();

handle.use(cors);
//handle.use(checkAuth);

handle.get(checkAuth, async (req, res) => {
    const { query, contaId } = req.query;
    const imobiliarias = await prisma.imobiliaria.findMany({
        where: {
            OR: [
                {
                    contaId: req.user.contaId,
                },
                {
                    nomeFantasia: {
                        contains: query,
                    },
                },
                {
                    razaoSocial: {
                        contains: query,
                    },
                },
            ],
        },
        include: {
            conta: true,
        },
    });
    res.send(imobiliarias);
});

handle.post(async (req, res) => {
    try {
        const {
            codigo,
            cnpj,
            razaoSocial,
            bairro,
            cep,
            cidade,
            email,
            endereco,
            complemento,
            estado,
            ie,
            nomeFantasia,
            url,
            telefone,
            site,
            numero,
            contaId,
            usuario,
            senha,
            confirmarSenha,
        } = req.body;
        const data = await prisma.imobiliaria.create({
            data: {
                codigo,
                cnpj,
                razaoSocial,
                bairro,
                cep,
                cidade,
                email,
                endereco,
                complemento,
                estado,
                ie,
                nomeFantasia,
                url,
                telefone,
                site,
                numero,
                contaId: contaId ? Number(contaId) : 2,
            },
        });

        const usuarioExiste = await prisma.usuario.findFirst({
            where: {
                OR: [
                    {
                        email: usuario?.email,
                    },
                    {
                        documento: usuario?.documento,
                    },
                ],
                imobiliariaId: data.id,
                cargos: {
                    some: {
                        codigo: "imobiliaria",
                    },
                },
            },
        });
        if (usuarioExiste) {
            await prisma.usuario.update({
                where: {
                    imobiliariaId_documento: {
                        documento: usuario.documento,
                        imobiliariaId: data.id,
                    },
                },
                data: {
                    nome: usuario.nome,
                    documento: usuario.documento,
                    email: usuario.email,
                    senhaHash: usuario.senha ? bcrypt.hashSync(usuario.senha, 10) : "",
                    imobiliaria: {
                        connect: {
                            id: data.id,
                        },
                    },
                    cargos: {
                        connect: {
                            codigo: "imobiliaria",
                        },
                    },
                    modulos: {
                        connect: [
                            {
                                codigo: "imobiliaria.processos",
                            },
                            {
                                codigo: "imobiliaria.processos.modelos",
                            },
                            {
                                codigo: "imobiliaria.imoveis",
                            },
                            {
                                codigo: "imobiliaria.usuarios",
                            },
                            {
                                codigo: "imobiliaria.configuracoes",
                            },
                        ],
                    },
                    permissoes: {
                        connect: [
                            {
                                codigo: "imobiliaria.processos.visualizar",
                            },
                            {
                                codigo: "imobiliaria.processos.cadastrar",
                            },
                            {
                                codigo: "imobiliaria.processos.editar",
                            },
                            {
                                codigo: "imobiliaria.processos.excluir",
                            },
                            {
                                codigo: "imobiliaria.processos.visualizarTodos",
                            },
                        ],
                    },
                },
            });
        } else {
            await prisma.usuario.create({
                data: {
                    nome: usuario.nome,
                    documento: usuario.documento,
                    email: usuario.email,
                    imobiliaria: {
                        connect: {
                            id: data.id,
                        },
                    },
                    senhaHash: usuario.senha ? bcrypt.hashSync(usuario.senha, 10) : "",
                    cargos: {
                        connect: {
                            codigo: "imobiliaria",
                        },
                    },
                    modulos: {
                        connect: [
                            {
                                codigo: "imobiliaria.processos",
                            },
                            {
                                codigo: "imobiliaria.processos.modelos",
                            },
                            {
                                codigo: "imobiliaria.usuarios",
                            },
                            {
                                codigo: "imobiliaria.imoveis",
                            },
                            {
                                codigo: "imobiliaria.configuracoes",
                            },
                        ],
                    },
                    permissoes: {
                        connect: [
                            {
                                codigo: "imobiliaria.processos.visualizar",
                            },
                            {
                                codigo: "imobiliaria.processos.cadastrar",
                            },
                            {
                                codigo: "imobiliaria.processos.editar",
                            },
                            {
                                codigo: "imobiliaria.processos.excluir",
                            },
                            {
                                codigo: "imobiliaria.processos.visualizarTodos",
                            },
                        ],
                    },
                },
            });
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            message: (err as Error).message
        });
    } finally {
        res.end();
    }
});
handle.delete(checkAuth, async (req, res) => {
    try {
        const { ids } = req.query;
        let arrayIds = JSON.parse(ids);
        //console.log(arrayIds, ids);
        if (!arrayIds.length) {
            return res
                .status(400)
                .send({ success: false, message: "Nenhum id informado" });
        }

        await prisma.imobiliaria.deleteMany({
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

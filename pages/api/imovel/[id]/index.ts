import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
import { checkAuth } from "@/middleware/checkAuth";
handle.use(cors);
handle.use(checkAuth);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.imovel.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            contrato: true,
            Processo: true,
            Tarefa: true,
            proprietarios: {
                include: {
                    proprietario: true,
                },
            },
        },
    });
    res.send(data);
});
handle.put(async (req, res) => {
    const { id } = req.query;
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
    const conta = await prisma.imovel.update({
        where: {
            id: Number(id),
        },
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
            conta: {},
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
    const { id } = req.query;
    const data = await prisma.imovel.delete({
        where: {
            id: Number(id),
        },
    });
    res.send(data);
});
export default handle;

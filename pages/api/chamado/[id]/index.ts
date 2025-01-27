import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect();
import { cors } from "@/middleware/cors";
handle.use(cors);
handle.get(async (req, res) => {
    const { id } = req.query;
    const data = await prisma.chamado.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            responsavel:true,
            anexos: true,
            assunto: {
                include: {
                    departamento: true,
                },
            },
            conta: true,
            contrato: {
                include: {
                    imovel: true,
                },
            },
            criador: true,
            imobiliaria: true,
            interacoes: {
                include: {
                    usuario: true,
                },
            },
            participantes: true,
            conversas: {
                include: {
                    participantes: true,
                    interacoes: {
                        include: {
                            usuario: true,
                        },
                    },
                },
            },
        },
    });
    res.send(data);
});

handle.post(async (req, res) => {
    try {
        const { id } = req.query;
        const { status, responsavel, participantes,assunto, departamento,bairroImovel,
            cepImovel,
            cidadeImovel,
            codigoContrato,
            complementoImovel,
            enderecoImovel,
            numeroImovel,
            estadoImovel,codigoImovel, assuntoId } = req.body;

        await prisma.chamado.update({
            where: {
                id: Number(id),
            },
            data: { 
                status,
                assunto:{
                    connect:{
                        id: assuntoId? Number(assuntoId):  Number(assunto.id)
                    }
                },
                responsavel:{
                    connect:{
                        id: Number(responsavel.id)
                    }
                },
                participantes: participantes.length > 0  ? {
                    set:  participantes.map(item => {
                        return {
                            id:Number(item.id)
                        }
                    })
                }:{},
                bairroImovel,
                cepImovel,
                cidadeImovel,
                codigoContrato,
                complementoImovel,
                enderecoImovel,
                numeroImovel,
                estadoImovel,codigoImovel
            },
        });
        res.send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default handle;

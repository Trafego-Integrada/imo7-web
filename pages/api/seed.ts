import prisma from "@/lib/prisma";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const arr = [
        "inquilinoArquivoCopiaCpf",
        "inquilinoArquivoComprovanteRenda",
        "inquilinoArquivoCertidaoNascimento",
        "inquilinoArquivoCertidaoCasamento",
        "inquilinoArquivoCertidaoDivorcio",
        "inquilinoArquivoCertidaoObito",
        "proprietarioDocumentosCopiaCnh",
        "proprietarioDocumentosComprovanteContaEnergia",
        "proprietarioDocumentosComprovanteContaAgua",
        "proprietarioDocumentosCopiaIptu",
        "InquilinoArquivosCopiaContratoSocial",
        "FiadorArquivoComprovanteRenda",
        "FiadorArquivoCertidaoNascimento",
        "FiadorArquivoCertidaoCasamento",
        "FiadorArquivoCertidaoDivorcio",
        "FiadorArquivoCertidaoObito",
        "FiadorArquivoComprovanteEndereco",
        "FiadorDocumentosRegistroImovelGaratia1",
        "inquilinoArquivoComprovanteEstadoCivil",
        "inquilinoArquivoUltimaAlteracaoContratual",
        "inquilinoArquivoCopiaDaMatricualDoIMovel",
        "inquilinoArquivoUltimasContasDeAguaPagas",
        "inquilinoArquivoUltimasContasDeEnergiaPagas",
        "ProprietarioDocumentosMatriculaImovel",
        "ProprietarioDocumentosPlantaDoImovel",
        "ProprietarioDocumentosHabitese",
        "ProprietarioDocumentosLaudoVistoriaBombeiro",
        "InquilinoArquivosUltimaDeclaracaoIr",
        "InquilinoArquivosMovimentacaoBancaria3Meses",
        "InquilinoArquivosUltimasFaturaCartaoCredito3Meses",
        "InquilinoArquivosExtratoAposentadoria",
        "FiadorDocumentosUltimaDeclaracaoIr",
        "FiadorDocumentosMovimentacaoBancaria3Meses",
        "FiadorDocumentosUltimasFaturaCartaoCredito3Meses",
        "FiadorArquivoMatriculaImovel",
        "InquilinoArquivos3UltimosAlugueisPagos",
        "InquilinoConjugeArquivosCarteiraTrabalho",
        "inquilinoDadosJuridicosCartaoCnpj",
        "InquilinoConjugeArquivosComprovanteRenda",
        "InquilinoArquivosCopiaComprovanteAluguelAtual",
        "EscrituraDeUniaoEstável",
        "CompradorDocumentosCertidaoDeNascimento",
        "CompradorDocumentosCertidaodDeCasamento",
        "CompradorDocumentosCertidãoDeEstadocivil",
        "CompradorDocumentosHolerite03UltimosRecebimentos.",
        "VendedorImovelCopiaMatricula",
        "VendedorDadosPessoaisOutrosAnexos",
        "CompradorDadosPessoaisOutrosAnexos",
        "CompradorComprovanteEstadoCivil",
        "VendedorImovelCopiaIptu",
        "VendedorImovelCopiaContaLuz",
        "VendedorImovelCopiaContaAgua",
        "VendedorImovelCopiaContaGas",
        "VendedorConjugeCopiaRgFrente",
        "VendedorConjugeCopiaRgVerso",
        "inquilinoArquivoFiadorComprovanteRenda",
        "inquilinoArquivoFiadorConjugeComprovanteRenda",
        "InquilinoArquivosCopiaContratoAluguelAtual",
    ];

    let notArr = [];

    const data2 = await prisma.campoFichaCadastral.updateMany({
        where: {
            codigo: {
                in: arr,
            },
        },
        data: {
            tipoCampo: "files",
        },
    });

    res.send(data2);
});

export default handler;

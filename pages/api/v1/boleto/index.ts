import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "@/lib/prisma";

const handle = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handle.get(async (req, res) => {
    const boletos = await prisma.boleto.findMany({
        where: {
            contaId: 1,
        },
    });
    res.send(boletos);
});

handle.post(async (req, res) => {
    const {
        boletos,
        bols_cpf_cnpj,
        bols_codl,
        envia_email,
        field_cod_banco,
        local_pgto1,
        local_pgto2,
        data_vencimen,
        beneficiario,
        ag_cod_beneficiar,
        data_doc,
        num_doc2,
        num_doc,
        especie_doc,
        aceite,
        data_proces,
        nosso_numero2,
        reservado,
        carteira,
        especie2,
        qtd2,
        xvalor,
        valor_doc2,
        instrucoes1,
        instrucoes2,
        instrucoes3,
        instrucoes4,
        instrucoes5,
        instrucoes6,
        instrucoes7,
        instrucoes8,
        instrucoes9,
        instrucoes10,
        sacado2_nome,
        sacado2_endereco,
        sacado2_city_uf_cep,
        linha_digitavel,
        barcode,
        desconto2,
        outras_deducoes2,
        mora_multa2,
        outros_acrescimos2,
        valorcobrado2,
        nao_receber_apos,
        email_sacado,
        nome_razao_sacado,
        endereco_sacado,
        numero_sacado,
        complemento_sacado,
        cep_sacado,
        bairro_sacado,
        cidade_sacado,
        telefone_sacado,
        uf_sacado,
        email_beneficiario,
        cpf_cnpj_beneficiario,
        imobiliariaId,
        contratoId,
    } = req.body;
    if (boletos && boletos.length) {
        boletos.map(async (boleto, key) => {
            const contrato = await prisma.contrato.upsert({
                where: {
                    codigo: Number(boleto.bols_codl),
                },
                create: {
                    codigo: Number(boleto.bols_codl),

                    inquilinos: {
                        connectOrCreate: {
                            where: {
                                documento: boleto.bols_cpf_cnpj,
                            },
                            create: {
                                documento: boleto.bols_cpf_cnpj,
                                nome: boleto.nome_razao_sacado,
                            },
                        },
                    },
                    imobiliaria: {
                        connectOrCreate: {
                            where: {
                                cnpj: boleto.cpf_cnpj_beneficiario,
                            },
                            create: {
                                cnpj: boleto.cpf_cnpj_beneficiario,
                                razaoSocial: boleto.beneficiario,
                                email: boleto.email_beneficiario,
                            },
                        },
                    },
                    conta: {
                        connect: {
                            id: 1,
                        },
                    },
                },
                update: {
                    codigo: Number(boleto.bols_codl),

                    inquilinos: {
                        connectOrCreate: {
                            where: {
                                documento: boleto.bols_cpf_cnpj,
                            },
                            create: {
                                documento: boleto.bols_cpf_cnpj,
                                nome: boleto.nome_razao_sacado,
                            },
                        },
                    },
                    imobiliaria: {
                        connectOrCreate: {
                            where: {
                                cnpj: boleto.cpf_cnpj_beneficiario,
                            },
                            create: {
                                cnpj: boleto.cpf_cnpj_beneficiario,
                                razaoSocial: boleto.beneficiario,
                                email: boleto.email_beneficiario,
                            },
                        },
                    },
                    conta: {
                        connect: {
                            id: 1,
                        },
                    },
                },
            });
            const {
                bols_cpf_cnpj,
                bols_codl,
                envia_email,
                field_cod_banco,
                local_pgto1,
                local_pgto2,
                data_vencimen,
                beneficiario,
                ag_cod_beneficiar,
                data_doc,
                num_doc2,
                num_doc,
                especie_doc,
                aceite,
                data_proces,
                nosso_numero2,
                reservado,
                carteira,
                especie2,
                qtd2,
                xvalor,
                valor_doc2,
                instrucoes1,
                instrucoes2,
                instrucoes3,
                instrucoes4,
                instrucoes5,
                instrucoes6,
                instrucoes7,
                instrucoes8,
                instrucoes9,
                instrucoes10,
                sacado2_nome,
                sacado2_endereco,
                sacado2_city_uf_cep,
                linha_digitavel,
                barcode,
                desconto2,
                outras_deducoes2,
                mora_multa2,
                outros_acrescimos2,
                valorcobrado2,
                nao_receber_apos,
                email_sacado,
                nome_razao_sacado,
                endereco_sacado,
                numero_sacado,
                complemento_sacado,
                cep_sacado,
                bairro_sacado,
                cidade_sacado,
                telefone_sacado,
                uf_sacado,
                email_beneficiario,
                cpf_cnpj_beneficiario,
            } = boleto;

            await prisma.boleto.create({
                data: {
                    bols_cpf_cnpj,
                    bols_codl,
                    envia_email,
                    field_cod_banco,
                    local_pgto1,
                    local_pgto2,
                    data_vencimen,
                    beneficiario,
                    ag_cod_beneficiar,
                    data_doc,
                    num_doc2,
                    num_doc,
                    especie_doc,
                    aceite,
                    data_proces,
                    nosso_numero2,
                    reservado,
                    carteira,
                    especie2,
                    qtd2,
                    xvalor,
                    valor_doc2,
                    instrucoes1,
                    instrucoes2,
                    instrucoes3,
                    instrucoes4,
                    instrucoes5,
                    instrucoes6,
                    instrucoes7,
                    instrucoes8,
                    instrucoes9,
                    instrucoes10,
                    sacado2_nome,
                    sacado2_endereco,
                    sacado2_city_uf_cep,
                    linha_digitavel,
                    barcode,
                    desconto2,
                    outras_deducoes2,
                    mora_multa2,
                    outros_acrescimos2,
                    valorcobrado2,
                    nao_receber_apos,
                    email_sacado,
                    nome_razao_sacado,
                    endereco_sacado,
                    numero_sacado,
                    complemento_sacado,
                    cep_sacado,
                    bairro_sacado,
                    cidade_sacado,
                    telefone_sacado,
                    uf_sacado,
                    email_beneficiario,
                    cpf_cnpj_beneficiario,
                    contaId: 1,
                    contratoId: contrato.id,
                },
            });
        });
        res.status(201).send();
    } else {
        const boleto = await prisma.boleto.create({
            data: {
                inquilino: {
                    connect: {
                        imobiliariaId_documento: {
                            documento: bols_cpf_cnpj,
                            imobiliariaId: Number(imobiliariaId),
                        },
                    },
                },
                bols_codl,
                envia_email,
                field_cod_banco,
                local_pgto1,
                local_pgto2,
                data_vencimen,
                beneficiario,
                ag_cod_beneficiar,
                data_doc,
                num_doc2,
                num_doc,
                especie_doc,
                aceite,
                data_proces,
                nosso_numero2,
                reservado,
                carteira,
                especie2,
                qtd2,
                xvalor,
                valor_doc2,
                instrucoes1,
                instrucoes2,
                instrucoes3,
                instrucoes4,
                instrucoes5,
                instrucoes6,
                instrucoes7,
                instrucoes8,
                instrucoes9,
                instrucoes10,
                sacado2_nome,
                sacado2_endereco,
                sacado2_city_uf_cep,
                linha_digitavel,
                barcode,
                desconto2,
                outras_deducoes2,
                mora_multa2,
                outros_acrescimos2,
                valorcobrado2,
                nao_receber_apos,
                email_sacado,
                nome_razao_sacado,
                endereco_sacado,
                numero_sacado,
                complemento_sacado,
                cep_sacado,
                bairro_sacado,
                cidade_sacado,
                telefone_sacado,
                uf_sacado,
                email_beneficiario,
                cpf_cnpj_beneficiario,
                conta: {
                    connect: {
                        id: 1,
                    },
                },
                imobiliaria: {
                    connect: {
                        id: Number(imobiliariaId),
                    },
                },
                contrato: {
                    connect: {
                        id: Number(contratoId),
                    },
                },
            },
        });

        res.send(boleto);
    }
});

export default handle;

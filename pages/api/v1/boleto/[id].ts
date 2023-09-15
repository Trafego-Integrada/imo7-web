import nextConnect from "next-connect";
import prisma from "@/lib/prisma";
import moment from "moment";

const handle = nextConnect();

handle.get(async (req, res) => {
    const { id } = req.query;
    const boleto = await prisma.boleto.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!boleto) {
        res.status(400).json({
            success: false,
            errorCode: "B01",
            message: "Boleto não encontrado",
        });
    }
    res.send(boleto);
});

handle.post(async (req, res) => {
    const { id } = req.query;
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
    const boleto = await prisma.boleto.update({
        where: {
            id: Number(id),
        },
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
            data_vencimen: data_vencimen
                ? moment(data_vencimen, "DD/MM/YYYY").format()
                : null,
            beneficiario,
            ag_cod_beneficiar,
            data_doc: data_doc ? moment(data_doc, "DD/MM/YYYY").format() : null,
            num_doc2,
            num_doc,
            especie_doc,
            aceite,
            data_proces: data_proces
                ? moment(data_proces, "DD/MM/YYYY").format()
                : null,
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
            contrato: contratoId
                ? {
                      connect: {
                          id: Number(contratoId),
                      },
                  }
                : {},
        },
    });
    res.send(boleto);
});

handle.delete(async (req, res) => {
    const { id } = req.query;
    const boleto = await prisma.boleto.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!boleto) {
        res.status(400).json({
            success: false,
            errorCode: "B01",
            message: "Boleto não encontrado",
        });
    }
    await prisma.boleto.delete({
        where: { id: Number(id) },
    });
    res.send();
});

export default handle;

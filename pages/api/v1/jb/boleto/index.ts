import { NextApiResponse } from "next-auth/internals/utils";
import nextConnect from "next-connect";
import prisma from "../../../../../lib/prisma";
import { NextApiRequestWithUser } from "../../../../../types/auth";

const handle = nextConnect<NextApiRequestWithUser, NextApiResponse>();

handle.post(async (req, res) => {
    const {
        contratoId,
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
    } = req.body;
    await prisma.contrato.upsert({
        where,
    });
    res.send("ok");
});

export default handle;

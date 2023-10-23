import { formatoData, removerCaracteresEspeciais } from "@/helpers/helpers";
import pdf from "@/lib/pdf";
import prisma from "@/lib/prisma";
import { Flex } from "@chakra-ui/react";
import Barcode from "react-barcode";

const Boleto = ({ boleto }) => {
    return (
        <>
            <div
                dangerouslySetInnerHTML={{
                    __html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${boleto?.beneficiario}</title>
<style type="text/css">
    @media print {
        .noprint {
            display: none;
        }
    }

    body {
        background-color: #ffffff;
        margin-right: 0;
    }

    .table-boleto {
        font: 9px Helvetica;
    }

    .table-boleto td {
        border-left: 1px solid #000;
        border-top: 1px solid #000;
    }

    .table-boleto td:last-child {
        border-right: 1px solid #000;
    }

    .table-boleto .titulo {
        color: #000033;
    }

    .linha-pontilhada {
        color: #000033;
        font: 9px Helvetica;
        width: 100%;
        border-bottom: 1px dashed #000;
        text-align: right;
        margin-bottom: 10px;
    }

    .table-boleto .conteudo {
        font: bold 10px Helvetica;
        height: 13px;
    }

    .table-boleto .sacador {
        display: inline;
        margin-left: 5px;
    }

    .table-boleto td {
        padding: 1px 4px;
    }

    .cabecalho {
        border-right: 1px solid black;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
    }

    .table-boleto .noleftborder {
        border-left: none !important;
    }

    .table-boleto .notopborder {
        border-top: none !important;
    }

    .table-boleto .norightborder {
        border-right: none !important;
    }

    .table-boleto .noborder {
        border: none !important;
    }

    .table-boleto .bottomborder {
        border-bottom: 1px solid #000 !important;
    }

    .table-boleto .rtl {
        text-align: right;
    }

    .table-boleto .logobanco {
        display: inline-block;
        max-width: 150px;
    }

    .table-boleto .logocontainer {
        width: 257px;
        display: inline-block;
    }

    .table-boleto .logobanco img {
    }

    .table-boleto .codbanco {
        font: bold 20px Helvetica;
        padding: 1px 5px;
        display: inline;
        border-left: 2px solid #000;
        border-right: 2px solid #000;
        width: 51px;
        margin-left: 25px;
    }

    .table-boleto .linha-digitavel {
        font: bold 14px Helvetica;
        display: inline-block;
        width: 406px;
        text-align: right;
    }

    .table-boleto .nopadding {
        padding: 0 !important;
    }

    .table-boleto .caixa-gray-bg {
        font-weight: bold;
        background: #ccc;
    }

    .info {
        font: 11px Helvetica;
    }

    .info-empresa {
        font: 11px Helvetica;
    }

    .header {
        font: bold 13px Helvetica;
        display: block;
        margin: 4px;
    }

    .barcode {
        height: 50px;
    }

    .barcode div {
        display: inline-block;
        height: 100%;
    }

    .barcode .black {
        border-color: #000;
        border-left-style: solid;
        width: 0;
    }

    .barcode .white {
        background: #fff;
    }

    .barcode .thin.black {
        border-left-width: 1px;
    }

    .barcode .large.black {
        border-left-width: 3px;
    }

    .barcode .thin.white {
        width: 1px;
    }

    .barcode .large.white {
        width: 3px;
    }
</style>
</head>
<body>
<div style="width: 666px; margin: auto;">
<table class="table-boleto cabecalho" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
        <td valign="bottom" class="noborder nopadding" width="175px">
            <div class="logobanco" style="padding:15px;">
                
                    <img src="${boleto?.imobiliaria?.logo}" width="75px">
                
            </div>
        </td>
        <td valign="bottom" class="noborder nopadding" width="175px">
            <div class="conteudo" style="text-align:right;padding:15px;font:Helvetica;font-size:10px;
            font-weight:bold;">
            ${boleto?.imobiliaria?.endereco}, Nº ${
                        boleto?.imobiliaria?.numero
                    }, ${boleto?.imobiliaria?.bairro}, ${
                        boleto?.imobiliaria?.cidade
                    }/ ${boleto?.imobiliaria?.estado}
               </div>
        </td>
    </tr>
</table>
<br><br>
<table class="table-boleto" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
        <td valign="bottom" colspan="5" class="noborder nopadding">
            <div style="display:flex; align-items:center">
            <div class="logocontainer">
                <div class="logobanco">
                    <img src="/img/boleto/logo-${
                        boleto?.field_cod_banco &&
                        boleto?.field_cod_banco?.slice(0, 3)
                    }.jpg">
                </div>
                <div class="codbanco">${boleto?.field_cod_banco}</div>
            </div>
            <div class="linha-digitavel">${boleto?.linha_digitavel}</div>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2" width="250px">
            <div class="titulo">Beneficiário</div>
            <div class="conteudo">${boleto?.beneficiario}</div>
        </td>
        <td>
            <div class="titulo">CPF/CNPJ</div>
            <div class="conteudo">${boleto?.cpf_cnpj_beneficiario}</div>
        </td>
        <td width="120px">
            <div class="titulo">Agência/Cód. Beneficiário</div>
            <div class="conteudo rtl">${boleto?.ag_cod_beneficiar}</div>
        </td>
        <td width="160px">
            <div class="titulo">Vencimento</div>
            <div class="conteudo rtl">${formatoData(
                boleto?.data_vencimen?.slice(0, 10)
            )}</div>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <div class="titulo">Pagador</div>
            <div class="conteudo">${boleto?.sacado2_nome}</div>
        </td>
        <td>
            <div class="titulo">Nº documento</div>
            <div class="conteudo rtl">${boleto?.num_doc2}</div>
        </td>
        <td>
            <div class="titulo">Nosso número</div>
            <div class="conteudo rtl">${boleto?.nosso_numero2}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="titulo">Espécie</div>
            <div class="conteudo">R$</div>
        </td>
        <td>
            <div class="titulo">Quantidade</div>
            <div class="conteudo rtl">${
                boleto?.qtd2
            }<?php echo $dadosboleto['qtd2'] ?></div>
        </td>
        <td>
            <div class="titulo">Valor</div>
            <div class="conteudo rtl">${
                boleto?.xvalor
            }<?php if($dadosboleto['xvalor']!=0) {echo $dadosboleto['xvalor'];} ?></div>
        </td>
        <td>
            <div class="titulo">(-) Descontos / Abatimentos</div>
            <div class="conteudo rtl">${
                boleto?.desconto2
            }<?php if($dadosboleto['desconto2']!=0) {echo $dadosboleto['desconto2'];} ?></div>
        </td>
        <td>
            <div class="titulo">(=) Valor Documento</div>
            <div class="conteudo rtl">${
                boleto?.valor_doc2
            }<?php echo number_format($dadosboleto['valor_doc2'] - $dadosboleto['desconto2'], 2,',','.') ?></div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div class="conteudo"></div>
            <div class="titulo">Demonstrativo</div>
        </td>
        <td>
            <div class="titulo">(-) Outras deduções</div>
            <div class="conteudo">${
                boleto?.outras_deducoes2
            }<?php if($dadosboleto['outras_deducoes2']!=0) {echo $dadosboleto['outras_deducoes2'];} ?></div>
        </td>
        <td>
            <div class="titulo">(+) Outros acréscimos</div>
            <div class="conteudo rtl">${
                boleto?.outros_acrescimos2
            }<?php if($dadosboleto['outros_acrescimos2']!=0) {echo $dadosboleto['outros_acrescimos2'];} ?></div>
        </td>
        <td>
            <div class="titulo">(=) Valor cobrado</div>
            <div class="conteudo rtl">${
                boleto?.valorcobrado2
            }<?php number_format($dadosboleto['valorcobrado2'] - $dadosboleto['valorcobrado2'], 2,',','.') ?></div>
        </td>
    </tr>
    <tr>
        <td colspan="4">
            <div style="margin-top: 10px" class="conteudo"></div>
        </td>
        <td class="noleftborder">
            <div class="titulo">Autenticação mecânica</div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo"></div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo"></div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo"></div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder bottomborder">
            <div style="margin-bottom: 10px;" class="conteudo"></div>
        </td>
    </tr>
</table>
<br>

<div class="linha-pontilhada">Corte na linha pontilhada</div>
<br>
<table class="table-boleto" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td valign="bottom" colspan="6" class="noborder nopadding" >
        <div style="display:flex; align-items:center">
        <div class="logocontainer">
            <div class="logobanco">
                <img src="/img/boleto/logo-${boleto?.field_cod_banco?.slice(
                    0,
                    3
                )}.jpg">
            </div>
            <div class="codbanco">${
                boleto?.field_cod_banco
            }<?php echo $dadosboleto['field_cod_banco'] ?></div>
        </div>
        <div class="linha-digitavel">${
            boleto?.linha_digitavel
        }<?php echo $dadosboleto['linha_digitavel'] ?></div>
        </div>
        </td>
    </tr>
    <tr>
        <td colspan="5">
            <div class="titulo">Local de pagamento</div>
            <div class="conteudo">${boleto?.local_pgto1}</div>
        </td>
        <td width="155px">
            <div class="titulo">Vencimento</div>
            <div class="conteudo rtl">${formatoData(
                boleto?.data_vencimen?.slice(0, 10)
            )}</div>
        </td>
    </tr>
    <tr>
        <td colspan="4">
            <div class="titulo">Beneficiário</div>
            <div class="conteudo">${boleto?.beneficiario}</div>
        </td>
        <td>
            <div class="titulo">CPF/CNPJ</div>
            <div class="conteudo">${boleto?.cpf_cnpj_beneficiario}</div>
        </td>
        <td>
            <div class="titulo">Agência/Cód. Beneficiário</div>
            <div class="conteudo rtl">${boleto?.ag_cod_beneficiar}</div>
        </td>
    </tr>
    <tr>
        <td width="110px">
            <div class="titulo">Data do documento</div>
            <div class="conteudo">${formatoData(
                boleto?.data_doc?.slice(0, 10)
            )}</div>
        </td>
        <td width="120px">
            <div class="titulo">Nº documento</div>
            <div class="conteudo">${boleto?.num_doc2}</div>
        </td>
        <td width="60px">
            <div class="titulo">Espécie doc.</div>
            <div class="conteudo">${boleto?.especie_doc}</div>
        </td>
        <td>
            <div class="titulo">Aceite</div>
            <div class="conteudo">${boleto?.aceite}</div>
        </td>
        <td width="110px">
            <div class="titulo">Data processamento</div>
            <div class="conteudo">${formatoData(
                boleto?.data_proces?.slice(0, 10)
            )}</div>
        </td>
        <td>
            <div class="titulo">Nosso número</div>
            <div class="conteudo rtl">${boleto?.nosso_numero2}</div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="titulo">Uso do banco</div>
            <div class="conteudo"></div>
        </td>
        <td>
            <div class="titulo">Carteira</div>
            <div class="conteudo">${boleto?.carteira}</div>
        </td>
        <td>
            <div class="titulo">Espécie</div>
            <div class="conteudo">R$</div>
        </td>
        <td>
            <div class="titulo">Quantidade</div>
            <div class="conteudo">${boleto?.qtd2}</div>
        </td>
        <td>
            <div class="titulo">Valor</div>
            <div class="conteudo">${boleto?.xvalor}</div>
        </td>
        <td>
            <div class="titulo">(=) Valor Documento</div>
            <div class="conteudo rtl">${boleto?.valor_doc2}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5">
            <div class="titulo">Instruções (Texto de responsabilidade do cedente)</div>
        </td>
        <td>
            <div class="titulo">(-) Descontos / Abatimentos</div>
            <div class="conteudo rtl">${boleto?.desconto2}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo">${boleto?.instrucoes1}</div>
            <div class="conteudo">${boleto?.instrucoes2}</div>
        </td>
        <td>
            <div class="titulo">(-) Outras deduções</div>
            <div class="conteudo rtl">${boleto?.outras_deducoes2}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo">${boleto?.instrucoes3}</div>
            <div class="conteudo">${boleto?.instrucoes4}</div>
        </td>
        <td>
            <div class="titulo">(+) Mora / Multa</div>
            <div class="conteudo rtl">${boleto?.valorcobrado2}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo">${boleto?.instrucoes5}</div>
            <div class="conteudo">${boleto?.instrucoes6}</div>
        </td>
        <td>
            <div class="titulo">(+) Outros acréscimos</div>
            <div class="conteudo rtl">${boleto?.outros_acrescimos2}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5" class="notopborder">
            <div class="conteudo">${boleto?.instrucoes7}</div>
            <div class="conteudo">${boleto?.instrucoes8}</div>
        </td>
        <td>
            <div class="titulo">(=) Valor cobrado</div>
            <div class="conteudo rtl">${
                boleto?.valorcobrado2
            }<?php if($dadosboleto['valorcobrado2']!=0){echo $dadosboleto['valorcobrado2'];} ?></div>
        </td>
    </tr>
    <tr>
        <td colspan="5">
            <div class="titulo">Pagador</div>
            <div class="conteudo">${
                boleto?.sacado2_nome
            } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  CPF/CNPJ: ${
                        boleto?.bols_cpf_cnpj
                    }</div>
            <div class="conteudo">${boleto?.sacado2_endereco}</div>
            <div class="conteudo">${boleto?.sacado2_city_uf_cep}</div>
        </td>
        <td class="noleftborder">
            <div class="titulo" style="margin-top: 50px">Cód. Baixa</div>
        </td>
    </tr>
    <tr>
        <td colspan="4" class="noleftborder">
            <div class="titulo" style="display: none">Sacador/Avalista
                <div class="conteudo sacador">${boleto?.beneficiario}</div>
            </div>
        </td>
        <td colspan="2" class="norightborder noleftborder">
            <div class="conteudo noborder rtl">Autenticação mecânica - Ficha de Compensação</div>
        </td>
    </tr>
    
</table>
</div>
</body>
</html>`,
                }}
            ></div>

            <Flex justify="center">
                <Barcode
                    value={boleto.barcode}
                    height={50}
                    format="CODE128"
                    displayValue={false}
                />
            </Flex>
        </>
    );
};
const Page = ({ boleto }) => {
    return <Boleto boleto={boleto} />;
};

export default Page;
export const getServerSideProps = async ({ req, res, query }) => {
    const { id } = query;
    const response = await prisma.boleto?.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            imobiliaria: true,
        },
    });
    let boleto = JSON.parse(JSON.stringify(response));
    const exportPDF = query.pdf === "true";
    const isServer = !!req;

    if (isServer && exportPDF) {
        const buffer = await pdf.componentToPDFBuffer(
            <Boleto boleto={boleto} />
        );

        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        res.setHeader(
            "Content-disposition",
            `attachment; filename=${boleto?.id}.pdf`
        );

        // set content type
        res.setHeader("Content-Type", "application/pdf");

        // output the pdf buffer. once res.end is triggered, it won't trigger the render method
        res.end(buffer);
    }

    return {
        props: {
            boleto,
        },
    };
};

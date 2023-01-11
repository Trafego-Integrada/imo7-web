import { Box } from "@chakra-ui/react";

const Page = () => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `<?php
    $logo = explode('-', $dadosboleto['field_cod_banco']);
    ?>
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title><?= $dadosboleto['beneficiario']; ?></title>
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
                        <?php if($imobiliaria['configuracao']['logo']) {?>
                            <img src="./uploads/<?=$imobiliaria['configuracao']['logo']?>" width="75px">
                        <?php } ?>
                    </div>
                </td>
                <td valign="bottom" class="noborder nopadding" width="175px">
                    <div class="conteudo" style="text-align:right;padding:15px;font:Helvetica;font-size:10px;
                    font-weight:bold;">
                        <?php echo $imobiliaria['endereco']['logradouro'] . ', ' . $imobiliaria['endereco']['numero'] . ' - ' .
                            $imobiliaria['endereco']['bairro_id'] . ' - ' . $imobiliaria['endereco']['cidade_id'] . ' / ' . $imobiliaria['endereco']['estado_id'] ?>
                    </div>
                </td>
            </tr>
        </table>
        <br><br>
        <table class="table-boleto" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td valign="bottom" colspan="5" class="noborder nopadding">
                    <div class="logocontainer">
                        <div class="logobanco">
                            <img src="./assets/images/boleto/logo-<?=$logo[0]?>.jpg">
                        </div>
                        <div class="codbanco"><?php echo $dadosboleto['field_cod_banco'] ?></div>
                    </div>
                    <div class="linha-digitavel"><?php echo $dadosboleto['linha_digitavel'] ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="2" width="250px">
                    <div class="titulo">Beneficiário</div>
                    <div class="conteudo"><?php echo $dadosboleto['beneficiario'] ?></div>
                </td>
                <td>
                    <div class="titulo">CPF/CNPJ</div>
                    <div class="conteudo"><?= $dadosboleto['cpf_cnpj_beneficiario'] ?></div>
                </td>
                <td width="120px">
                    <div class="titulo">Agência/Cód. Beneficiário</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['ag_cod_beneficiar'] ?></div>
                </td>
                <td width="160px">
                    <div class="titulo">Vencimento</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['data_vencimen'] ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <div class="titulo">Pagador</div>
                    <div class="conteudo"><?php echo $dadosboleto['sacado2_nome'] ?></div>
                </td>
                <td>
                    <div class="titulo">Nº documento</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['num_doc2'] ?></div>
                </td>
                <td>
                    <div class="titulo">Nosso número</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['nosso_numero2'] ?></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="titulo">Espécie</div>
                    <div class="conteudo">R$</div>
                </td>
                <td>
                    <div class="titulo">Quantidade</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['qtd2'] ?></div>
                </td>
                <td>
                    <div class="titulo">Valor</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['xvalor']!=0) {echo $dadosboleto['xvalor'];} ?></div>
                </td>
                <td>
                    <div class="titulo">(-) Descontos / Abatimentos</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['desconto2']!=0) {echo $dadosboleto['desconto2'];} ?></div>
                </td>
                <td>
                    <div class="titulo">(=) Valor Documento</div>
                    <div class="conteudo rtl"><?php echo number_format($dadosboleto['valor_doc2'] - $dadosboleto['desconto2'], 2,',','.') ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="conteudo"></div>
                    <div class="titulo">Demonstrativo</div>
                </td>
                <td>
                    <div class="titulo">(-) Outras deduções</div>
                    <div class="conteudo"><?php if($dadosboleto['outras_deducoes2']!=0) {echo $dadosboleto['outras_deducoes2'];} ?></div>
                </td>
                <td>
                    <div class="titulo">(+) Outros acréscimos</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['outros_acrescimos2']!=0) {echo $dadosboleto['outros_acrescimos2'];} ?></div>
                </td>
                <td>
                    <div class="titulo">(=) Valor cobrado</div>
                    <div class="conteudo rtl"><?php number_format($dadosboleto['valorcobrado2'] - $dadosboleto['valorcobrado2'], 2,',','.') ?></div>
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
                <td valign="bottom" colspan="6" class="noborder nopadding">
                    <div class="logocontainer">
                        <div class="logobanco">
                            <img src="./assets/images/boleto/logo-<?=$logo[0]?>.jpg" alt="logotipo do banco">
                        </div>
                        <div class="codbanco"><?php echo $dadosboleto['field_cod_banco'] ?></div>
                    </div>
                    <div class="linha-digitavel"><?php echo $dadosboleto['linha_digitavel'] ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <div class="titulo">Local de pagamento</div>
                    <div class="conteudo"><?php echo $dadosboleto['local_pgto1'] ?></div>
                </td>
                <td width="155px">
                    <div class="titulo">Vencimento</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['data_vencimen'] ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <div class="titulo">Beneficiário</div>
                    <div class="conteudo"><?php echo $dadosboleto['beneficiario'] ?></div>
                </td>
                <td>
                    <div class="titulo">CPF/CNPJ</div>
                    <div class="conteudo"><?= $dadosboleto['cpf_cnpj_beneficiario'] ?></div>
                </td>
                <td>
                    <div class="titulo">Agência/Cód. Beneficiário</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['ag_cod_beneficiar'] ?></div>
                </td>
            </tr>
            <tr>
                <td width="110px">
                    <div class="titulo">Data do documento</div>
                    <div class="conteudo"><?php echo $dadosboleto['data_doc'] ?></div>
                </td>
                <td width="120px">
                    <div class="titulo">Nº documento</div>
                    <div class="conteudo"><?php echo $dadosboleto['num_doc2'] ?></div>
                </td>
                <td width="60px">
                    <div class="titulo">Espécie doc.</div>
                    <div class="conteudo"><?php echo $dadosboleto['especie_doc'] ?></div>
                </td>
                <td>
                    <div class="titulo">Aceite</div>
                    <div class="conteudo"><?php echo $dadosboleto['aceite'] ?></div>
                </td>
                <td width="110px">
                    <div class="titulo">Data processamento</div>
                    <div class="conteudo"><?php echo $dadosboleto['data_proces'] ?></div>
                </td>
                <td>
                    <div class="titulo">Nosso número</div>
                    <div class="conteudo rtl"><?php echo $dadosboleto['nosso_numero2'] ?></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="titulo">Uso do banco</div>
                    <div class="conteudo"></div>
                </td>
                <td>
                    <div class="titulo">Carteira</div>
                    <div class="conteudo"><?php echo $dadosboleto['carteira'] ?></div>
                </td>
                <td>
                    <div class="titulo">Espécie</div>
                    <div class="conteudo">R$</div>
                </td>
                <td>
                    <div class="titulo">Quantidade</div>
                    <div class="conteudo"><?php echo $dadosboleto['qtd2'] ?></div>
                </td>
                <td>
                    <div class="titulo">Valor</div>
                    <div class="conteudo"><?php if($dadosboleto['xvalor']!=0){echo $dadosboleto['xvalor'];} ?></div>
                </td>
                <td>
                    <div class="titulo">(=) Valor Documento</div>
                    <div class="conteudo rtl"><?php echo number_format($dadosboleto['valor_doc2'], 2,',','.') ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <div class="titulo">Instruções (Texto de responsabilidade do cedente)</div>
                </td>
                <td>
                    <div class="titulo">(-) Descontos / Abatimentos</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['desconto2']!=0){echo $dadosboleto['desconto2'];} ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5" class="notopborder">
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes1']; ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes2']; ?></div>
                </td>
                <td>
                    <div class="titulo">(-) Outras deduções</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['outras_deducoes2']!=0) {echo $dadosboleto['outras_deducoes2'];} ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5" class="notopborder">
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes3']; ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes4']; ?></div>
                </td>
                <td>
                    <div class="titulo">(+) Mora / Multa</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['mora_multa2']!=0){echo $dadosboleto['mora_multa2'];} ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5" class="notopborder">
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes5']; ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes6']; ?></div>
                </td>
                <td>
                    <div class="titulo">(+) Outros acréscimos</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['outros_acrescimos2']!=0){echo $dadosboleto['outros_acrescimos2'];} ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5" class="notopborder">
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes7']; ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['instrucoes8']; ?></div>
                </td>
                <td>
                    <div class="titulo">(=) Valor cobrado</div>
                    <div class="conteudo rtl"><?php if($dadosboleto['valorcobrado2']!=0){echo $dadosboleto['valorcobrado2'];} ?></div>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <div class="titulo">Pagador</div>
                    <div class="conteudo"><?php echo $dadosboleto['sacado2_nome'] ?> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <?= ($dadosboleto['bols_cpf_cnpj'] ? 'CPF/CNPJ: '.$dadosboleto['bols_cpf_cnpj']: null ) ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['sacado2_endereco'] ?></div>
                    <div class="conteudo"><?php echo $dadosboleto['sacado2_city_uf_cep'] ?></div>
                </td>
                <td class="noleftborder">
                    <div class="titulo" style="margin-top: 50px">Cód. Baixa</div>
                </td>
            </tr>
            <tr>
                <td colspan="4" class="noleftborder">
                    <div class="titulo" style="display: none">Sacador/Avalista
                        <div class="conteudo sacador"><?php echo $dadosboleto['beneficiario']; ?></div>
                    </div>
                </td>
                <td colspan="2" class="norightborder noleftborder">
                    <div class="conteudo noborder rtl">Autenticação mecânica - Ficha de Compensação</div>
                </td>
            </tr>
            <tr>
                <td colspan="6" class="noborder">
                    <?php fbarcode($dadosboleto['barcode']) ?>
                </td>
            </tr>
        </table>
    </div>
    </body>
    </html>`,
            }}
        ></div>
    );
};

export default Page;

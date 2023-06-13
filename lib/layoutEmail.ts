import { formatoValor } from "@/helpers/helpers";
import moment from "moment";

export const layoutRecuperarSenha = ({
    nome,
    codigoRecuperacao,
}) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
<head>
<meta charset="UTF-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="telephone=no" name="format-detection">
<title>Nova mensagem 2</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- -->
<link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"><!--<![endif]-->
<style type="text/css">
#outlook a {
padding:0;
}
.ExternalClass {
width:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height:100%;
}
.es-button {
mso-style-priority:100!important;
text-decoration:none!important;
}
a[x-apple-data-detectors] {
color:inherit!important;
text-decoration:none!important;
font-size:inherit!important;
font-family:inherit!important;
font-weight:inherit!important;
line-height:inherit!important;
}
.es-desk-hidden {
display:none;
float:left;
overflow:hidden;
width:0;
max-height:0;
line-height:0;
mso-hide:all;
}
[data-ogsb] .es-button {
border-width:0!important;
padding:15px 25px 15px 25px!important;
}
[data-ogsb] .es-button.es-button-1 {
padding:5px 25px 5px 20px!important;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style>
</head>
<body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0">
<div class="es-wrapper-color" style="background-color:transparent"><!--[if gte mso 9]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
<v:fill type="tile" color="transparent" origin="0.5, 0" position="0.5, 0"></v:fill>
</v:background>
<![endif]-->
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent">
<tr class="gmail-fix" height="0" style="border-collapse:collapse">
<td style="padding:0;Margin:0">
<table cellspacing="0" cellpadding="0" border="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:600px">
<tr style="border-collapse:collapse">
<td cellpadding="0" cellspacing="0" border="0" style="padding:0;Margin:0;line-height:1px;min-width:600px" height="0"><img src="https://knnbex.stripocdn.email/content/guids/CABINET_837dc1d79e3a5eca5eb1609bfe9fd374/images/41521605538834349.png" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;max-height:0px;min-height:0px;min-width:600px;width:600px" alt width="600" height="1"></td>
</tr>
</table></td>
</tr>
<tr style="border-collapse:collapse">
<td valign="top" style="padding:0;Margin:0">
<table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#7C72DC;background-repeat:repeat;background-position:center top">
<tr style="border-collapse:collapse">
<td style="padding:0;Margin:0;background-color:#305674" bgcolor="#305674" align="center">
<table class="es-header-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
<tr style="border-collapse:collapse">
<td align="left" style="Margin:0;padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td valign="top" align="center" style="padding:0;Margin:0;width:580px">
<table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:25px;padding-bottom:25px;font-size:0px"><img src="https://knnbex.stripocdn.email/content/guids/CABINET_36c02b00aededb433bf6600994123a63/images/logolight.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="148"></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
<tr style="border-collapse:collapse">
<td style="padding:0;Margin:0;background-color:#e2e8f0" bgcolor="#E2E8F0" align="center">
<table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center">
<tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td valign="top" align="center" style="padding:0;Margin:0;width:600px">
<table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:4px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
<tr style="border-collapse:collapse">
<td align="center" style="Margin:0;padding-top:25px;padding-bottom:25px;padding-left:30px;padding-right:30px"><h1 style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:normal;color:#111111">Olá, ${nome}</h1></td>
</tr>
<tr style="border-collapse:collapse">
<td bgcolor="#ffffff" align="center" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:20px;padding-right:20px;font-size:0">
<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td style="padding:0;Margin:0;border-bottom:1px solid #ffffff;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
<tr style="border-collapse:collapse">
<td align="center" bgcolor="#e2e8f0" style="padding:0;Margin:0;background-color:#e2e8f0">
<table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
<tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td valign="top" align="center" style="padding:0;Margin:0;width:600px">
<table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
<tr style="border-collapse:collapse">
<td class="es-m-txt-l" bgcolor="#ffffff" align="center" style="Margin:0;padding-bottom:15px;padding-top:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#666666;font-size:16px">Clique no botão abaixo para redefinir sua senha</p></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
<tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:30px;padding-right:30px">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td valign="top" align="center" style="padding:0;Margin:0;width:540px">
<table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px"><span class="es-button-border" style="border-style:solid;border-color:#fec32b;background:#305674;border-width:0px;display:inline-block;border-radius:11px;width:auto"><a href="https://desmistificandofii.com.br/recuperar-senha/${codigoRecuperacao}" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:16px;border-style:solid;border-color:#305674;border-width:5px 25px 5px 20px;display:inline-block;background:#305674;border-radius:11px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center">Recuperar senha</a></span></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
<tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0">
<table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center">
<tr style="border-collapse:collapse">
<td align="left" style="padding:0;Margin:0">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td valign="top" align="center" style="padding:0;Margin:0;width:600px">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr style="border-collapse:collapse">
<td align="center" style="padding:0;Margin:0;display:none"></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
</div>
</body>
</html>`;

export const emailBoleto = ({
    nomeDestinatario,
    conteudo,
    complemento,
    imobiliaria,
    idBoleto,
}) => `
<!-- Inliner Build Version 4380b7741bb759d6cb997545f3add21ad48f010b -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>imprima seu boleto - @Imobiliaria</title>
</head>
<body leftmargin="0"
      marginwidth="0"
      topmargin="0"
      marginheight="0"
      offset="0"
      bgcolor="#FAFAFA"
      style="width: 100% !important; -webkit-text-size-adjust: none; background: #FAFAFA; margin: 0; padding: 0;">
<style type="text/css">
    .headerContent a:visited {
        color: #336699;
        font-weight: normal;
        text-decoration: underline;
    }

    .bodyContent div a:visited {
        color: #336699;
        font-weight: normal;
        text-decoration: underline;
    }

    .dataTableHeading a:visited {
        color: #FFFFFF;
        font-weight: bold;
        text-decoration: underline;
    }

    .dataTableContent a:visited {
        color: #202020;
        font-weight: bold;
        text-decoration: underline;
    }

    .templateButton a:visited {
        color: #FFFFFF;
        font-family: 'Arial', sans-serif;
        font-size: 15px;
        font-weight: bold;
        letter-spacing: -.5px;
        line-height: 100%;
        text-align: center;
        text-decoration: none;
    }

    .footerContent div a:visited {
        color: #336699;
        font-weight: normal;
        text-decoration: underline;
    }
</style>
<center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" bgcolor="#FAFAFA"
           style="height: 100% !important; width: 100% !important; background: #FAFAFA; margin: 0; padding: 0;">
        <tr>
            <td align="center" valign="top" style="padding-top: 20px; border-collapse: collapse;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"
                       style="background: #FFFFFF; border: 1px solid #dddddd;" bgcolor="#FFFFFF">
					
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse;">
                                <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"
                                       bgcolor="#FFFFFF" style="border-bottom-width: 0; background: #FFFFFF;">
                                    <tr>
                                        <td class="headerContent" align="center" valign="middle"
                                            style="border-collapse: collapse; color: #202020; font-family: 'Arial', sans-serif; font-size: 34px; font-weight: bold; line-height: 100%; text-align: center; vertical-align: middle; padding: 0;">
                                            <img src="${imobiliaria?.logo}"
                                                 style="height:75px; line-height: 100%; outline: none; text-decoration: none; border: 0;"
                                                 height="75" id="headerImage campaign-icon"/>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody">
                                <tr>
                                    <td valign="top" style="border-collapse: collapse;">
                                        <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                            <tr>
                                                <td valign="top" class="bodyContent" bgcolor="#FFFFFF"
                                                    style="border-collapse: collapse; background: #FFFFFF;">
                                                    <div class="std_content00" align="left"
                                                         style="color: #505050; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 150%; text-align: left;">
                                                        <h4 class="h4" align="left"
                                                            style="color: #202020; display: block; font-family: 'Arial', sans-serif; font-size: 22px; font-weight: bold; line-height: 100%; text-align: left; margin: 0;">
                                                            Olá ${nomeDestinatario},
                                                        </h4>
                                                        <p>${conteudo}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding-top: 0; border-collapse: collapse;">
                                                    <table border="0" cellpadding="15" cellspacing="0"
                                                           class="templateButton" bgcolor="#336699"
                                                           style="-moz-border-radius: 3px; -webkit-border-radius: 3px; border-collapse: separate !important; border-radius: 3px; color: #FFFFFF; font-family: 'Arial', sans-serif; font-size: 15px; font-weight: bold; letter-spacing: -.5px; line-height: 100%; text-align: center; text-decoration: none; background: #336699; border: 0;">
                                                        <tr>
                                                            <td valign="middle" class="templateButtonContent"
                                                                style="border-collapse: collapse;">
                                                                <div class="std_content02">
                                                                    <a href="https://www.imo7.com.br/api/boleto/${idBoleto}/pdf"
                                                                       target="_blank"
                                                                       style="color: #FFFFFF; font-family: 'Arial', sans-serif; font-size: 15px; font-weight: bold; letter-spacing: -.5px; line-height: 100%; text-align: center; text-decoration: none;">
                                                                        Clique aqui para realizar o download do boleto
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="15" cellspacing="0" class="">
                                                        <tr>
                                                            <td valign="middle" class="bodyContent" bgcolor="#FFFFFF"
                                                                style="border-collapse: collapse; background: #FFFFFF;">
                                                                <div class="std_content00" align="center"
                                                                     style="text-align: center; color: #505050; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 150%;">
                                                                    ou copie e cole a url abaixo no seu navegador de
                                                                    internet
                                                                    <br/>
                                                                </div>
                                                                <div class="std_content00" align="center"
                                                                     style="text-align: center; font-size: 11px; color: #505050; font-family: 'Arial', sans-serif; line-height: 150%;">
                                                                     https://www.imo7.com.br/api/boleto/${idBoleto}/pdf
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
											
                                            ${
                                                complemento &&
                                                `<tr>
                                                    <td valign="top" class="bodyContent" bgcolor="#FFFFFF"
                                                        style="border-collapse: collapse; background: #FFFFFF;">
                                                        <div class="std_content00" align="left"
                                                            style="color: #505050; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 150%; text-align: left;">
                                                            <p>${complemento}</p>
                                                        </div>
                                                    </td>
                                                </tr>`
                                            }
											
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <hr>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="border-collapse: collapse;">
                            <table border="0" cellpadding="10" cellspacing="0" width="600" id="templateFooter"
                                   style="border-top-width: 0; background: #FFFFFF;" bgcolor="#FFFFFF">
                                <tr>
                                    <td valign="top" class="footerContent" style="border-collapse: collapse;">
                                        <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                            <tr>
                                                <td valign="middle" id="utility"
                                                    width="120"
                                                    style="border-collapse: collapse; background: #FFFFFF; border: 0;"
                                                    bgcolor="#FFFFFF">
                                                    <img src="${
                                                        imobiliaria?.logo
                                                    }"
                                                         width="100">
                                                </td>
                                                <td valign="middle" id="utility"
                                                    style="border-collapse: collapse; background: #FFFFFF; border: 0;"
                                                    bgcolor="#FFFFFF">
                                                    <div class="std_utility"
                                                         style="color: #707070; font-family: 'Arial', sans-serif; font-size: 12px; line-height: 125%; text-align: left;">
                                                        <strong>${
                                                            imobiliaria?.razaoSocial
                                                        }
                                                            <br/></strong>
														${imobiliaria?.telefone}<br/>
														${imobiliaria?.endereco},
														${imobiliaria?.numero}<br/>
														${imobiliaria?.bairro}<br/>
														${imobiliaria?.cidade}/
														${imobiliaria?.estado}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <hr>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top" style="border-collapse: collapse;">
                            <div class="std_footer"
                                 style="color: #707070; padding: 20px; font-family: 'Arial', sans-serif; font-size: 12px; line-height: 125%; text-align: center;"
                                 align="center">
                                <small>Esta mensagem pode conter informação confidencial ou
                                    privilegiada, sendo seu sigilo protegido por lei. Se você
                                    não for o destinatário ou a pessoa autorizada a receber
                                    esta
                                    mensagem, não pode usar, copiar ou divulgar as
                                    informações
                                    nela contidas ou tomar qualquer ação baseada nessas
                                    informações. Se você recebeu esta mensagem por engano,
                                    por
                                    favor, avise imediatamente ao remetente, respondendo o
                                    e-mail e em seguida apague-a. Agradecemos sua cooperação.
                                </small>
                            </div>
                            <br/>
                            <div class="std_footer"
                                 style="color: #707070; padding: 10px; font-family: 'Arial', sans-serif; font-size: 12px; line-height: 125%; text-align: center;"
                                 align="center">
                                <em>
                                    Todos os direitos reservados © 
                                    ${moment().format("YYYY")}
									${imobiliaria?.razaoSocial}.
                                </em>
                            </div>
                        </td>
                    </tr>
                </table>

                <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
                       style="width:600px;">
                    <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                <![endif]-->
                <div style="margin:0px auto;max-width:600px;">
                    <br>
                    <img alt="" title="" height="auto"
                         src="https://gerenciadordeimobiliarias.com.br/boletos/assets/images/assinatura.png"
                         style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;"
                         width="600">
                </div>
                <!--[if mso | IE]>
                </td></tr></table>
                <![endif]-->
            </td>
        </tr>
    </table>
</center>
</body>
</html>

`;

export const emailExtrato = ({ imobiliaria, extrato, nomeDestinatario }) => `
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <title>Seu extrato já pode ser visualizado</title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table, td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width: 480px) {
            @-ms-viewport {
                width: 320px;
            }
            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
        .outlook-group-fix {
            width: 100% !important;
        }
    </style>
    <![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,500" rel="stylesheet" type="text/css">
    <style type="text/css">

        @import url(https://fonts.googleapis.com/css?family=Roboto:300,500);

    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
                width: 100% !important;
            }

            .mj-column-per-80 {
                width: 80% !important;
            }

            .mj-column-per-50 {
                width: 50% !important;
            }

            .mj-column-per-65 {
                width: 65% !important;
            }

            .mj-column-per-35 {
                width: 35% !important;
            }
        }
    </style>
</head>
<body style="background: #d7dde5;">
<div style="background-color:#d7dde5;"><!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;">
                                    <div class="mj-column-per-100 outlook-group-fix" data-vertical-align="top"
                                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                               border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="word-break:break-word;font-size:0px;padding:10px 25px;"
                                                        align="center">
                                                        <table role="presentation" cellpadding="0" cellspacing="0"
                                                               style="border-collapse:collapse;border-spacing:0px;"
                                                               align="center" border="0">
                                                            <tbody>
                                                            <tr>
                                                                <td style="width:50px;">
																	
                                                                        <img alt="Resumo do extrato"
                                                                             title="Resumo do extrato"
                                                                             src="${
                                                                                 imobiliaria?.logo
                                                                             }"
                                                                             style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;max-height: 100px;"
                                                                             height="75">
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                    <div class=""
                                         style="cursor:auto;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:500;line-height:24px;text-align:left;">
                                        Olá ${nomeDestinatario}, seu extrato já pode ser
                                        visualizado!
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                    <div class=""
                                         style="cursor:auto;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:left;">
                                        <p>Confira abaixo um resumo do extrato do período:${
                                            extrato?.periodo
                                        }
                                            <br>
                                            <small>Imóvel: ${
                                                extrato.contrato?.imovel
                                                    ?.endereco
                                            }</small>
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:480px;">
                    <![endif]-->
                    <div class="mj-column-per-80 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                    <table cellpadding="0" cellspacing="0"
                                           style="cellspacing:0px;color:#000;font-family:Roboto, Helvetica, sans-serif;font-size:14px;line-height:22px;table-layout:auto;"
                                           width="100%" border="0">
                                        <tr style="border-top:1px solid #ecedee;">
                                            <td style="padding: 12px;">Contrato</td>
                                            <td style="padding: 12px;text-align: right;">${
                                                extrato?.contrato?.codigo
                                            }</td>
                                        </tr>
                                        <tr style="border-top:1px solid #ecedee;">
                                            <td style="padding: 12px;">Parcela</td>
                                            <td style="padding: 12px;text-align: right;">${
                                                extrato?.parcela
                                            }</td>
                                        </tr>
                                        <tr style="border-top:1px solid #ecedee;">
                                            <td style="padding: 12px;">Vencimento</td>
                                            <td style="padding: 12px;text-align: right;">${moment(
                                                extrato?.vencimento
                                            ).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        <tr style="border-top:1px solid #ecedee;">
                                            <td style="padding: 12px;">Depósito</td>
                                            <td style="padding: 12px;text-align: right;">${moment(
                                                extrato?.dataDeposito
                                            ).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        <tr style="border-top: 2px solid #7e7f80;;border-bottom:1px solid #ecedee;">
                                            <td style="padding: 12px;">Total</td>
                                            <td style="padding: 12px;text-align: right;">${formatoValor(
                                                extrato.itens?.reduce(
                                                    (acc, i) =>
                                                        Number(i.valor) + acc,
                                                    0
                                                )
                                            )}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center">
                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                           style="border-collapse:separate;" align="center" border="0">
                                        <tbody>
                                        <tr>
                                            <td style="border:none;border-radius:3px;color:white;cursor:auto;padding:10px 25px;"
                                                align="center" valign="middle" bgcolor="#ffb74d"><a
                                                        href="https://www.imo7.com.br/api/extrato/${
                                                            extrato?.id
                                                        }/pdf"
                                                        style="text-decoration:none;line-height:100%;background:#ffb74d;color:white;font-family:Helvetica;font-size:16px;font-weight:normal;text-transform:none;margin:0px;"
                                                        target="_blank">
                                                    Visualizar extrato completo
                                                </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;"><p
                                            style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                    <!--[if mso | IE]>
                                    <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0"
                                           style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"
                                           width="600">
                                        <tr>
                                            <td style="height:0;line-height:0;"> </td>
                                        </tr>
                                    </table><![endif]--></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center">
                                    <div class=""
                                         style="cursor:auto;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;">${
                                             imobiliaria?.razaoSocial
                                         }</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:300px;">
                    <![endif]-->
                    <div class="mj-column-per-50 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center">
                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                           style="border-collapse:separate;" align="center" border="0">
                                        <tbody>
                                        <tr>
                                            <td style="border:none;border-radius:3px;color:#616161;cursor:auto;padding:10px 25px;"
                                                align="center" valign="middle" bgcolor="white"><a
                                                        href="mailto:${
                                                            imobiliaria.emailEnvioExtrato
                                                        }"
                                                        style="text-decoration:none;line-height:100%;background:white;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:13px;font-weight:normal;text-transform:none;margin:0px;"
                                                        target="_blank">
													${imobiliaria.emailEnvioExtrato}
                                                </a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td>
                    <td style="vertical-align:top;width:300px;">
                    <![endif]-->
                        <div class="mj-column-per-50 outlook-group-fix"
                             style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                <tr>
                                    <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0"
                                               style="border-collapse:separate;" align="center" border="0">
                                            <tbody>
                                            <tr>
                                                <td style="border:none;border-radius:3px;color:#616161;cursor:auto;padding:10px 25px;"
                                                    align="center" valign="middle" bgcolor="white"><a
                                                            href="${
                                                                imobiliaria.site
                                                            }"
                                                            style="text-decoration:none;line-height:100%;background:white;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:13px;font-weight:normal;text-transform:none;margin:0px;"
                                                            target="_blank">
														${imobiliaria.site}
                                                    </a></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;background:white;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:white;"
               align="center" border="0">
            <tbody>
            <tr>
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align:top;width:600px;">
                    <![endif]-->
                    <div class="mj-column-per-100 outlook-group-fix"
                         style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                            <tr>
                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                    <div class=""
                                         style="cursor:auto;color:#616161;font-family:Roboto, Helvetica, sans-serif;font-size:11px;font-weight:300;line-height:24px;text-align:left;">
                                        Esta mensagem pode conter informação confidencial ou privilegiada, sendo seu
                                        sigilo
                                        protegido por lei. Se você não for o destinatário ou a pessoa autorizada a
                                        receber esta
                                        mensagem, não pode usar, copiar ou divulgar as informações nela contidas ou
                                        tomar qualquer ação
                                        baseada nessas informações. Se você recebeu esta mensagem por engano, por favor,
                                        avise
                                        imediatamente ao remetente, respondendo o e-mail e em seguida apague-a.
                                        Agradecemos sua
                                        cooperação.
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td></tr></table>
                    <![endif]--></td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
           style="width:600px;">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
        <br>
        <img alt="" title="" height="auto"
             src="https://gerenciadordeimobiliarias.com.br/boletos/assets/images/assinatura.png"
             style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;"
             width="600">
    </div>
    <!--[if mso | IE]>
    </td></tr></table>
    <![endif]--></div>
</body>
</html>
`;

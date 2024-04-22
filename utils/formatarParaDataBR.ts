export function formatarParaDataBR(data: string) {
    const [ano, mes, dia] = data.split('-')

    return `${dia}/${mes}/${ano}`
}
export function validarData(valor: string) {
    let date = new Date(valor);
    return !isNaN(date.getTime());
}
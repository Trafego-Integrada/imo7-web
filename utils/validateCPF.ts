export function validateCPF(value: any) {
    // Remove caracteres não numéricos
    const cleanedCPF = value.replace(/\D/g, '')

    // Verifica se o CPF possui 11 dígitos
    if (cleanedCPF.length !== 11) {
        return false
    }

    // Verifica se todos os dígitos são iguais, o que invalida o CPF
    if (/^(\d)\1+$/.test(cleanedCPF)) {
        return false
    }

    // Calcula os dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedCPF.charAt(i)) * (10 - i)
    }

    let mod = sum % 11
    const firstDigit = mod < 2 ? 0 : 11 - mod

    sum = 0
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanedCPF.charAt(i)) * (11 - i)
    }

    mod = sum % 11
    const secondDigit = mod < 2 ? 0 : 11 - mod

    // Verifica se os dígitos verificadores são válidos
    if (
        parseInt(cleanedCPF.charAt(9)) !== firstDigit ||
        parseInt(cleanedCPF.charAt(10)) !== secondDigit
    ) {
        return false
    }

    return true
}

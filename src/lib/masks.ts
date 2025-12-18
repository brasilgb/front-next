// Remove tudo que não for número
export function onlyNumbers(value: string) {
    return value.replace(/\D/g, "")
}

/* ================= CPF / CNPJ ================= */
export function maskCpfCnpj(value: string) {
    const numbers = onlyNumbers(value)

    if (numbers.length <= 11) {
        // CPF
        return numbers
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    }

    // CNPJ
    return numbers
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
}

/* ================= TELEFONE ================= */
export function maskPhone(value: string) {
    const numbers = onlyNumbers(value).slice(0, 11)

    if (numbers.length <= 10) {
        return numbers
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2")
    }

    return numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

/* ================= CEP ================= */
export function maskZipCode(value: string) {
    return onlyNumbers(value)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2")
}

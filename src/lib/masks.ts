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

/* ================= WHATSAPP ================= */
export function maskWhatsapp(value: string) {
    // Remove tudo que não seja número
    const onlyNumbers = value.replace(/\D/g, "")

    // Limita a quantidade de caracteres a 13
    return onlyNumbers.slice(0, 13)
}

/* ================= CEP ================= */
export function maskZipCode(value: string) {
    return onlyNumbers(value)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2")
}

export function maskMoney(value: any) {
    if (value) {
        var valorAlterado = value;
        valorAlterado = valorAlterado.replace(/\D/g, ""); // Remove todos os não dígitos
        valorAlterado = valorAlterado.replace(/(\d+)(\d{2})$/, "$1,$2"); // Adiciona a parte de centavos
        valorAlterado = valorAlterado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona pontos a cada três dígitos
        valorAlterado = valorAlterado;
        return value = valorAlterado;
    }
}

export function maskMoneyDot(value: any) {
    if (value) {
        var valorAlterado = value;
        valorAlterado = valorAlterado.replace(/\D/g, ""); // Remove todos os não dígitos
        valorAlterado = valorAlterado.replace(/(\d+)(\d{2})$/, "$1.$2"); // Adiciona a parte de centavos
        valorAlterado = valorAlterado;
        return value = valorAlterado;
    }
}
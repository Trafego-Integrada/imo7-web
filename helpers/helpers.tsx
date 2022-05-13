export const formatoData = (data, tipo = "DATA") => {
    switch (tipo) {
        case "DATA":
            return Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                new Date(data)
            );
        case "DATA_HORA":
            return Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(data));
        default:
            return Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                new Date(data)
            );
    }
};

export const formatoValor = (valor) => {
    return Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
};

import { format } from "date-fns"

export function formatarParaDataBR(data: string) {
    return format(new Date(data), 'dd/MM/yyyy')
}
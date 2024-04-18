import {
    Flex,
    Text,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from "@chakra-ui/react";
import { formatarParaDataBR } from '../../../../utils/formatarParaDataBR'

interface ITribunalSuperiorTrabalhoCNDT {
    nome: string;
    certidao: string;
    mensagem: string;
    emitiuCertidao: string;
    emissaoData: string;
    validade: string;
    processos_encontrados: string[];
    urlComprovante: string;
}

export interface IConsultaTribunalSuperiorTrabalhoCNDT {
    cpf?: string;
    cnpj?: string;
    tribunalSuperiorTrabalhoCNDT: ITribunalSuperiorTrabalhoCNDT
}

interface CNDTrabalhistaProps {
    data: string;
}

export const CNDTrabalhista = ({ data }: CNDTrabalhistaProps) => {
    return (
        <Text>{data}</Text>
    );
};


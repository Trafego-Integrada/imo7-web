import { Flex, Text, Link } from "@chakra-ui/react";

export interface IConsultaSituacaoCadastral {
    cpf: string;
    receitaFederal: {
        cpf: string;
        nome: string;
        situacaoCadastral: string;
        digitoVerificador: string;
        comprovante: string;
        dataNascimento: string;
        dataInscricao: string;
        anoObito: string;
        urlComprovante: string;
    };
}

interface SituacaoCPFProps {
    data: IConsultaSituacaoCadastral;
}

export const SituacaoCadastral = ({ data }: SituacaoCPFProps) => {
    const isRegular =
        data.receitaFederal.situacaoCadastral === "REGULAR" || false;

    return (
        <Flex gap={2} direction="column" flexWrap="wrap">
            <Text>
                CPF: <strong>{data.cpf}</strong>
            </Text>

            <Text>
                Nome: <strong>{data.receitaFederal.nome}</strong>
            </Text>

            <Flex gap={2} alignItems="center">
                Situação cadastral:{" "}
                <Text
                    bg={isRegular ? "green.500" : "red.500"}
                    color="white"
                    fontSize={13}
                    fontWeight="bold"
                    p={1}
                    rounded={4}
                >
                    {data.receitaFederal.situacaoCadastral}
                </Text>
            </Flex>

            <Text>
                Digito verificador:{" "}
                <strong>{data.receitaFederal.digitoVerificador}</strong>
            </Text>

            <Text>
                Comprovante: <strong>{data.receitaFederal.comprovante}</strong>
            </Text>

            <Text>
                Data de nascimento:{" "}
                <strong>{data.receitaFederal.dataNascimento}</strong>
            </Text>

            <Text>
                Data de inscrição:{" "}
                <strong>{data.receitaFederal.dataInscricao}</strong>
            </Text>

            {data.receitaFederal.anoObito && (
                <Text>
                    Ano óbito: <strong>{data.receitaFederal.anoObito}</strong>
                </Text>
            )}

            <Text>
                URL do comprovante:{" "}
                <Link
                    href={data.receitaFederal.urlComprovante}
                    color="blue.500"
                >
                    Clique para baixar o comprovante
                </Link>
            </Text>
        </Flex>
    );
};

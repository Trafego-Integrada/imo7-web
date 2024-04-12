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
    const isRegular = data.receitaFederal.situacaoCadastral === "REGULAR";

    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

    return (
        <Flex gap={2} direction="column" flexWrap="wrap">
            {renderDetail("CPF", data.cpf)}
            {renderDetail("Nome", data.receitaFederal.nome)}

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

            {renderDetail(
                "Digito verificador",
                data.receitaFederal.digitoVerificador
            )}
            {renderDetail("Comprovante", data.receitaFederal.comprovante)}
            {renderDetail(
                "Data de nascimento",
                data.receitaFederal.dataNascimento
            )}
            {renderDetail(
                "Data de inscrição",
                data.receitaFederal.dataInscricao
            )}

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

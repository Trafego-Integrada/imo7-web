import { Flex, Text } from "@chakra-ui/react";

export interface ISancoes {
    source: string;
    type: string;
    standardizedSanctionType: string;
    matchRate: number;
    nameUniquenessScore: number;
    startDate: string;
    endDate: string;
    details?: any;
}

interface SancoesProps {
    data: ISancoes;
}

export const Sancoes = ({ data }: SancoesProps) => {
    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

    return (
        <Flex gap={8} flexWrap="wrap">
            {renderDetail("Fonte", data.source)}
            {renderDetail("Tipo", data.type)}
            {renderDetail(
                "Tipo de sanção padronizado",
                data.standardizedSanctionType
            )}
            {renderDetail("Taxa de correspondência", data.matchRate)}
            {renderDetail(
                "Nome pontuação de exclusividade",
                data.nameUniquenessScore
            )}
            {renderDetail("Data de início", data.startDate)}
            {renderDetail("Data final", data.endDate)}
        </Flex>
    );
};


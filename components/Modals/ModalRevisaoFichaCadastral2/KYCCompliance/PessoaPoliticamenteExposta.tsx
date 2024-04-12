import { Flex, Text } from "@chakra-ui/react";

export interface IPessoaPoliticamenteExposta {
    level: string;
    jobTitle: string;
    department: string;
    motive: string;
    startDate: string;
    endDate: string;
}

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

interface PessoaPoliticamenteExpostaProps {
    data: IPessoaPoliticamenteExposta;
}

export const PessoaPoliticamenteExposta = ({
    data,
}: PessoaPoliticamenteExpostaProps) => {
    const renderDetail = (label: string, value: any) => (
        <Text>
            {label}: <strong>{value}</strong>
        </Text>
    );

    return (
        <Flex gap={8} flexWrap="wrap">
            {renderDetail("Nível", data.level)}
            {renderDetail("Cargo", data.jobTitle)}
            {renderDetail("Departamento", data.department)}
            {renderDetail("Motivo", data.motive)}
            {renderDetail("Data de início", data.startDate)}
            {renderDetail("Data final", data.endDate)}
        </Flex>
    );
};


import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

interface TipoConsultaProps {
    tipoConsultas: string[];
    fichaId: string;
}

export const Consultas = ({ tipoConsultas }: TipoConsultaProps) => {
    return (
        <Flex flexDir="column">
            <Text>Consultas Disponíveis</Text>
            <Flex gap={2}>
                {consultasDisponiveis.map((consulta) => (
                    <Box
                        key={consulta.codigo}
                        rounded="lg"
                        borderWidth={1}
                        p={4}
                    >
                        <Flex>
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Logo_Receita_Federal_do_Brasil.svg/1200px-Logo_Receita_Federal_do_Brasil.svg.png"
                                w={12}
                                h={12}
                            />
                            <Box>
                                <Text>{consulta?.nome}</Text>
                            </Box>
                        </Flex>
                        <Button
                            leftIcon={<FiSearch />}
                            size="xs"
                            variant="outline"
                        >
                            Consultar Agora
                        </Button>
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
};

const consultasDisponiveis = [
    {
        tipoConsulta: ["cpf"],
        codigo: "processos_pf",
        nome: "Consulta Processos no TJ",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "protestos_pf",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "receita_federal_cnd",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "sefaz_cnd",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista_mte",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "receita_federal_cpf",
    },
];

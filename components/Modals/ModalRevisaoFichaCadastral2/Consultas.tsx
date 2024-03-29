import { Flex, Grid, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { ModalPreview } from "../Preview";
import { Consulta } from "./Consulta";
import { Consulta2 } from "./Consulta2";

interface TipoConsultaProps {
    tipoConsultas?: string[];
    ficha: any;
    cpf?: string;
    cnpj?: string;
    uf?: string;
}

export const Consultas = ({ ficha, cpf, cnpj }: TipoConsultaProps) => {
    const preview = useRef();

    return (
        <Flex flexDir="column">
            <Text>
                Consultas Disponíveis | CPF {cpf} | CNPJ: {cnpj}
            </Text>
            <Grid gridTemplateColumns="repeat(6,1fr)" gap={2} overflow="auto">
                {consultasDisponiveis.map((consulta) => (
                    <Consulta
                        key={consulta.codigo}
                        consulta={consulta}
                        ficha={ficha}
                        cpf={cpf}
                        cnpj={cnpj}
                    />
                ))}

                {cpf &&
                    consultasDisponiveis2.map((consulta) => (
                        <Consulta2
                            key={consulta.codigo}
                            consulta={consulta}
                            cpf={cpf}
                            cnpj={cnpj}
                        />
                    ))}
            </Grid>
            <ModalPreview ref={preview} />
        </Flex>
    );
};

const consultasDisponiveis = [
    {
        tipoConsulta: ["cpf"],
        codigo: "receita_federal_cpf",
        nome: "Situação Cadastral do CPF",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "processos_pf",
        nome: "Processos Judiciais",
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "protestos_pf",
        nome: "Protestos",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "receita_federal_cnd",
        nome: "Certidão Negativa de Débitos Federais",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "sefaz_cnd",
        nome: "Certidão Negativa de Débitos Estaduais",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista",
        nome: "Certidão Negativa de Débitos Trabalhistas",
    },
    {
        tipoConsulta: ["cpf", "cnpj"],
        codigo: "cnd_trabalhista_mte",
        nome: "Certidão Negativa de Débitos Trabalhistas do MTE",
    },
];

const consultasDisponiveis2 = [
    {
        tipoConsulta: ["cpf"],
        codigo: "endereco-cpf",
        nome: "Endereços por CPF",
    },
];

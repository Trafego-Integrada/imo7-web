import { Flex, Grid, Text } from "@chakra-ui/react";
import { Consulta } from "./Consulta";
import { Consulta2 } from "./Consulta2";

interface TipoConsultaProps {
    tipoConsultas?: string[];
    ficha: any;
    cpf?: string;
    cnpj?: string;
    uf?: string;
    dataNascimento: string;
    campoFichaCadastralCodigo: string;
}

import imageCDP from "../../../assets/cartorio-de-protesto.svg";
import imageEndereco from "../../../assets/endereco.svg";
import imageRF from "../../../assets/receita-federal.svg";
import imageVF from "../../../assets/validacao-facial.svg";
import imageTJ from "../../../assets/tribunal-de-justica-tj.svg";

export const Consultas = ({
    ficha,
    cpf,
    cnpj,
    dataNascimento,
    campoFichaCadastralCodigo,
}: TipoConsultaProps) => {
    return (
        <Flex flexDir="column">
            {(cpf || cnpj) && (
                <Text>
                    Consultas Disponíveis
                    {cpf && ` | CPF: ${cpf}`}
                    {cnpj && ` | CNPJ: ${cnpj}`}
                </Text>
            )}

            <Grid
                gridTemplateColumns="repeat(6,1fr)"
                gap={2}
                overflow="auto"
                py={3}
            >
                {cpf &&
                    outrasConsultas.map((consulta) => (
                        <Consulta2
                            key={consulta.codigo}
                            consulta={consulta}
                            cpf={cpf}
                            campoFichaCadastralCodigo={
                                campoFichaCadastralCodigo
                            }
                            fichaCadastralId={ficha.id}
                        />
                    ))}

                {consultasNetrin.map((consulta) => (
                    <Consulta
                        key={consulta.codigo}
                        consulta={consulta}
                        ficha={ficha}
                        cpf={cpf}
                        cnpj={cnpj}
                        dataNascimento={dataNascimento}
                    />
                ))}
            </Grid>
        </Flex>
    );
};

const consultasNetrin = [
    {
        tipoConsulta: ["cpf"],
        codigo: "endereco_cpf",
        nome: "Endereços",
        image: imageEndereco,
        size: ["3.5rem", "3.5rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "receita_federal_cpf",
        nome: "Situação Cadastral do CPF",
        image: imageRF,
        size: ["6rem", "6rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "processos_pf",
        nome: "Tribunal de Justiça (território Nacional)",
        image: imageTJ,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "protestos_pf",
        nome: "Protestos",
        image: imageCDP,
        size: ["7rem", "7rem"],
    },
];

const outrasConsultas = [
    {
        tipoConsulta: ["cpf"],
        codigo: "validacao-facial",
        nome: "Validação Facial",
        image: imageVF,
        size: ["4rem", "4rem"],
    },
];

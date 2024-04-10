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

            <Flex
                gap={2}
                py={3}
                flexWrap='wrap'
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
            </Flex>
        </Flex>
    );
};

const consultasNetrin = [
    {
        tipoConsulta: ["cpf"],
        codigo: "endereco_cpf",
        nome: "Endereços",
        image: imageEndereco,
        size: ["2rem", "2rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "receita_federal_cpf",
        nome: "Situação Cadastral do CPF",
        image: imageRF,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "processos_pf",
        nome: "Tribunal de Justiça (território Nacional)",
        image: imageTJ,
        size: ["2rem", "2rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "protestos_pf",
        nome: "Protestos PF",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cpj"],
        codigo: "protestos_pj",
        nome: "Protestos PJ",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "empresas_relacionadas_cpf",
        nome: "Empresas Relacionadas ao CPF",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cnpj"],
        codigo: "pessoas_relacionadas_cnpj",
        nome: "Pessoas Relacionadas ao CNPJ",
        image: imageCDP,
        size: ["4rem", "4rem"],
    }
];

const outrasConsultas = [
    {
        tipoConsulta: ["cpf"],
        codigo: "validacao-facial",
        nome: "Validação Facial",
        image: imageVF,
        size: ["2rem", "2rem"],
    },
];

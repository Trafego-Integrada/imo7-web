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
    const preview = useRef();

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
                    consultasDisponiveis2.map((consulta) => (
                        <Consulta2
                            key={consulta.codigo}
                            consulta={consulta}
                            cpf={cpf}
                            dataNascimento={dataNascimento}
                            campoFichaCadastralCodigo={
                                campoFichaCadastralCodigo
                            }
                            fichaCadastralId={ficha.id}
                        />
                    ))}

                {consultasDisponiveis.map((consulta) => (
                    <Consulta
                        key={consulta.codigo}
                        consulta={consulta}
                        ficha={ficha}
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

const consultasDisponiveis2 = [
    {
        tipoConsulta: ["cpf"],
        codigo: "validacao-facial",
        nome: "Validação Facial",
        image: imageVF,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: ["cpf"],
        codigo: "endereco-cpf",
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
];

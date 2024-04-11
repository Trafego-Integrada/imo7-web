import {
    Flex,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import { Consulta } from "./Consulta";
import { ValidacaoFacial } from "./ValidacaoFacial";

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
import imageTJ from "../../../assets/tribunal-de-justica-tj.svg";

const EnumTipoConsulta = {
    CPF: "CPF",
    CNPJ: "CNPJ",
    CPF_CNPJ: "CPF_CNPJ",
};

export const Consultas = ({
    ficha,
    cpf,
    cnpj,
    dataNascimento,
    campoFichaCadastralCodigo,
}: TipoConsultaProps) => {
    function filtrarConsultas(tipoConsulta: string) {
        return (
            <Flex gap={2} py={3} flexWrap="wrap">
                {tipoConsulta === EnumTipoConsulta.CPF && (
                    <ValidacaoFacial
                        cpf={cpf}
                        fichaCadastralId={ficha.id}
                        campoFichaCadastralCodigo={campoFichaCadastralCodigo}
                    />
                )}

                {consultasNetrin.map(
                    (consulta) =>
                        consulta.tipoConsulta.includes(tipoConsulta) && (
                            <Consulta
                                key={consulta.codigo}
                                consulta={consulta}
                                ficha={ficha}
                                cpf={cpf}
                                cnpj={cnpj}
                                dataNascimento={dataNascimento}
                            />
                        )
                )}
            </Flex>
        );
    }

    return (
        <Flex flexDir="column">
            <Tabs colorScheme="blue" variant="enclosed">
                <TabList>
                    <Tab fontWeight="bold" fontSize="sm">
                        Consultas de CPF
                    </Tab>
                    <Tab fontWeight="bold" fontSize="sm">
                        Consultas de CNPJ
                    </Tab>
                    <Tab fontWeight="bold" fontSize="sm">
                        Consultas de CPF e CNPJ
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel
                        border="1px"
                        borderColor="#e1e8f0"
                        rounded="md"
                        roundedTopLeft={0}
                    >
                        {cpf && (
                            <Text mb={2}>
                                CPF: <strong>{cpf}</strong>
                            </Text>
                        )}

                        {filtrarConsultas(EnumTipoConsulta.CPF)}
                    </TabPanel>

                    <TabPanel
                        border="1px"
                        borderColor="#e1e8f0"
                        rounded="md"
                        roundedTopLeft={0}
                    >
                        {cnpj && (
                            <Text mb={2}>
                                CNPJ: <strong>{cnpj}</strong>
                            </Text>
                        )}

                        {filtrarConsultas(EnumTipoConsulta.CNPJ)}
                    </TabPanel>

                    <TabPanel
                        border="1px"
                        borderColor="#e1e8f0"
                        rounded="md"
                        roundedTopLeft={0}
                    >
                        {cpf && cnpj && (
                            <Text mb={2}>
                                CPF: <strong>{cpf}</strong> • CNPJ:{" "}
                                <strong>{cnpj}</strong>
                            </Text>
                        )}

                        {filtrarConsultas(EnumTipoConsulta.CPF_CNPJ)}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
};

const consultasNetrin = [
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "endereco_cpf",
        nome: "Endereços",
        image: imageEndereco,
        size: ["2rem", "2rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "receita_federal_cpf",
        nome: "Situação Cadastral do CPF",
        image: imageRF,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "processos_pf",
        nome: "Tribunal de Justiça (território Nacional)",
        image: imageTJ,
        size: ["2rem", "2rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "protestos_pf",
        nome: "Protestos PF",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: "protestos_pj",
        nome: "Protestos PJ",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "empresas_relacionadas_cpf",
        nome: "Empresas Relacionadas ao CPF",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CNPJ],
        codigo: "pessoas_relacionadas_cnpj",
        nome: "Pessoas Relacionadas ao CNPJ",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
    {
        tipoConsulta: [EnumTipoConsulta.CPF],
        codigo: "pep_kyc_cpf",
        nome: "KYC e Compliance",
        image: imageCDP,
        size: ["4rem", "4rem"],
    },
];

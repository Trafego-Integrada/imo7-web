import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { FiEye, FiSearch, FiLink } from "react-icons/fi";
import { format, parse } from "date-fns";
import Image from "next/image";
import { Button, Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { cadastrarValidacao } from "@/services/models/validacaofacial";
import { buscarFicha } from "@/services/models/fichaCadastral";
import { apiNetrin } from "@/services/apiNetrin";
import { ModalResultadoEndereco } from "./ResultadosConsultas/Endereco/Modal";
import { ModalResultadoSituacaoCPF } from "./ResultadosConsultas/SituacaoCPF/Modal";

interface TipoConsultaProps {
    consulta: any;
    cpf?: string;
    dataNascimento?: string;
    uf?: string;
    campoFichaCadastralCodigo?: string;
    fichaCadastralId: string;
}

export interface IConsultaEndereco {
    logradouro: string;
    numero: string;
    bairro: string;
    complemento: string;
    cep: string;
    cidade: string;
    uf: string;
    pais: string;
    tipo: string;
    prioridade: number;
    vinculoRecente: boolean;
    latitude: number;
    longitude: number;
}

export interface IConsultaCPF {
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

export interface IValidacaoFacial {
    id: string;
    imobiliariaId: number;
    cpf: string;
    pin: string | null;
    resultado: string | null;
    createAt: string;
    updatedAt: string;
    deletedAt: string | null;
    status: number;
    fotoUrl: string | null;
    fichaCadastralId: string;
    fichaCadastralPreenchimentoFichaCadastralId: string;
    fichaCadastralPreenchimentoCampoFichaCadastralCodigo: string;
}

const token = "fd738b33-ad1d-4cda-bd47-47ffdeefad01";

export const Consulta2 = ({
    consulta,
    cpf,
    dataNascimento,
    campoFichaCadastralCodigo,
    fichaCadastralId,
}: TipoConsultaProps) => {
    const toast = useToast();
    const modalResultadoEndereco = useRef();
    const modalResultadoSituacaoCPF = useRef();

    const [enderecos, setEnderecos] = useState<IConsultaEndereco[]>([]);
    const [situacaoCPF, setSituacaoCPF] = useState<IConsultaCPF | null>(null);
    const [validacaoFacial, setValidacaoFacial] =
        useState<IValidacaoFacial | null>(null);

    const [consultandoNetrin, setConsultandoNetrin] = useState(false);

    const cadastrarValidacaoFacial = useMutation(cadastrarValidacao);

    // Chama a função de busca da validação facial assim que o componente carrega
    useEffect(() => {
        if (fichaCadastralId) buscar.mutate(fichaCadastralId);
    }, [fichaCadastralId]);

    // Busca a validação facial pelo campoFichaCadastralCodigo
    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            const obj = data.preenchimento.find(
                (obj: any) =>
                    obj["campoFichaCadastralCodigo"] ===
                    campoFichaCadastralCodigo
            );

            setValidacaoFacial(obj.validacaoFacial[0] || null);
        },
    });

    // Realiza as consultas de acordo com o código da consulta
    const consultar = async (codigo: string) => {
        try {
            setConsultandoNetrin(true);

            if (cpf) {
                if (codigo === "endereco-cpf") {
                    const response = await apiNetrin.get(
                        `consulta-composta?token=${token}&s=${codigo}&cpf=${cpf}`
                    );

                    if (response.data)
                        setEnderecos(response.data.enderecoCPF.endereco);
                }

                if (codigo === "receita_federal_cpf" && dataNascimento) {
                    const formatedDate = format(
                        parse(dataNascimento, "yyyyMMdd", new Date()),
                        "ddMMyyy"
                    );

                    const response = await apiNetrin.get(
                        `consulta-composta?token=${token}&s=${codigo}&data-nascimento=${formatedDate}&cpf=${cpf}`
                    );

                    if (response.data) setSituacaoCPF(response.data);
                }

                if (codigo === "validacao-facial") {
                    if (!validacaoFacial) {
                        const result =
                            await cadastrarValidacaoFacial.mutateAsync({
                                fichaCadastralId,
                                cpf,
                                campoFichaCadastralCodigo,
                            });

                        setValidacaoFacial(result.data || null);
                    }
                }
            }

            setConsultandoNetrin(false);
        } catch (error: any) {
            setConsultandoNetrin(false);

            toast({
                title: "Houve um problema",
                description: error?.response?.data?.message,
                status: "warning",
            });
        }
    };

    // Retorna se o botão de consulta estará habilitado ou desabilitado
    function isDisabledButton1(codigo: string) {
        if (codigo === "endereco-cpf") return false;
        if (codigo === "receita_federal_cpf") return false;
        if (codigo === "validacao-facial")
            return validacaoFacial ? true : false;
    }

    // Retorna se o botão de resultado estará habilitado ou desabilitado
    function isDisabledButton2(codigo: string) {
        if (codigo === "endereco-cpf") return enderecos.length === 0 || false;

        if (codigo === "receita_federal_cpf")
            return situacaoCPF === null || false;

        if (codigo === "validacao-facial") return !validacaoFacial;
    }

    // Retorna o texto do botão de resultado
    function buildTextButton2(codigo: string) {
        if (codigo === "endereco-cpf") return "Resultados";
        if (codigo === "receita_federal_cpf") return "Resultados";
        if (codigo === "validacao-facial") return "Copiar Link da Validação";
    }

    // Retorna o icone do botão de resultado
    function buildIconButton2(codigo: string) {
        if (codigo === "endereco-cpf") return <Icon as={FiEye} />;
        if (codigo === "receita_federal_cpf") return <Icon as={FiEye} />;
        if (codigo === "validacao-facial") return <Icon as={FiLink} />;
    }

    // Exibe os resultados ao clicar no botão de resultado
    function clickButton2(codigo: string) {
        if (codigo === "endereco-cpf")
            return modalResultadoEndereco?.current?.onOpen({
                data: enderecos,
            });

        if (codigo === "receita_federal_cpf")
            return modalResultadoSituacaoCPF?.current?.onOpen({
                data: situacaoCPF,
            });

        if (codigo === "validacao-facial") {
            if (validacaoFacial) {
                navigator.clipboard.writeText(
                    `${window.location.origin}/validacao-facial/${validacaoFacial.id}`
                );

                return toast({
                    title: "URL Copiada",
                });
            }
        }
    }

    return (
        <Flex
            key={consulta.codigo}
            rounded="lg"
            borderWidth={1}
            flexDir="column"
            justify="space-between"
            w="14rem"
        >
            <Flex
                flexDir="column"
                gap={3}
                p={4}
                align="center"
                justify="center"
                h="full"
            >
                <Image
                    alt="Receita Federal"
                    src={consulta.image}
                    style={{
                        width: consulta.size[0],
                        height: consulta.size[1],
                    }}
                />

                <Flex align="center">
                    <Text fontSize="small" textAlign="center" fontWeight="bold">
                        {consulta?.nome}
                    </Text>
                </Flex>
            </Flex>

            <Button
                w="full"
                variant="outline"
                size="xs"
                border={0}
                borderTop="1px"
                borderColor="#e1e8f0"
                rounded={0}
                py="1rem"
                leftIcon={<Icon as={FiSearch} />}
                isDisabled={isDisabledButton1(consulta.codigo)}
                onClick={() => consultar(consulta.codigo)}
                isLoading={consultandoNetrin}
            >
                Consultar
            </Button>

            <Button
                w="full"
                variant="outline"
                size="xs"
                border={0}
                borderTop="1px"
                borderColor="#e1e8f0"
                rounded={0}
                py="1rem"
                leftIcon={buildIconButton2(consulta.codigo)}
                isDisabled={isDisabledButton2(consulta.codigo)}
                onClick={() => clickButton2(consulta.codigo)}
            >
                {enderecos.length ? enderecos.length : ""}{" "}
                {buildTextButton2(consulta.codigo)}
            </Button>

            <ModalResultadoEndereco ref={modalResultadoEndereco} />
            <ModalResultadoSituacaoCPF ref={modalResultadoSituacaoCPF} />
        </Flex>
    );
};

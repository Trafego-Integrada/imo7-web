import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { FiSearch, FiLink } from "react-icons/fi";
import Image from "next/image";
import { Button, Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { cadastrarValidacao } from "@/services/models/validacaofacial";
import { buscarFicha } from "@/services/models/fichaCadastral";

interface TipoConsultaProps {
    consulta: any;
    cpf?: string;
    campoFichaCadastralCodigo?: string;
    fichaCadastralId: string;
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

export const Consulta2 = ({
    consulta,
    cpf,
    campoFichaCadastralCodigo,
    fichaCadastralId,
}: TipoConsultaProps) => {
    const toast = useToast();

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
        if (codigo === "validacao-facial") return !validacaoFacial;
    }

    // Retorna o texto do botão de resultado
    function buildTextButton2(codigo: string) {
        if (codigo === "validacao-facial") return "Copiar Link da Validação";
    }

    // Retorna o icone do botão de resultado
    function buildIconButton2(codigo: string) {
        if (codigo === "validacao-facial") return <Icon as={FiLink} />;
    }

    // Exibe os resultados ao clicar no botão de resultado
    function clickButton2(codigo: string) {
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
            w="12rem"
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
                {buildTextButton2(consulta.codigo)}
            </Button>
        </Flex>
    );
};

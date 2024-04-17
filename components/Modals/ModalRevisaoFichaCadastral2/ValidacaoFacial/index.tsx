import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { FiSearch, FiLink } from "react-icons/fi";
import { Button, Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { cadastrarValidacao } from "@/services/models/validacaofacial";
import { buscarFicha } from "@/services/models/fichaCadastral";
import Image from "next/image";

import imageVF from "../../../../assets/validacao-facial.svg";

interface TipoConsultaProps {
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

export const ValidacaoFacial = ({
    cpf,
    campoFichaCadastralCodigo,
    fichaCadastralId,
}: TipoConsultaProps) => {
    const toast = useToast();

    const [retorno, setRetorno] = useState<IValidacaoFacial | null>(null);

    const [loading, setLoading] = useState(false);

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

            setRetorno(obj.validacaoFacial[0] || null);
        },
    });

    const gerarValidacaoFacial = async () => {
        try {
            setLoading(true);

            if (cpf) {
                if (!retorno) {
                    const result = await cadastrarValidacaoFacial.mutateAsync({
                        fichaCadastralId,
                        cpf,
                        campoFichaCadastralCodigo,
                    });

                    setRetorno(result.data || null);
                }
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);

            toast({
                title: "Houve um problema",
                description: error?.response?.data?.message,
                status: "warning",
            });
        }
    };

    // Exibe os resultados ao clicar no botão de resultado
    function copiarLink() {
        if (retorno) {
            navigator.clipboard.writeText(
                `${window.location.origin}/validacao-facial/${retorno.id}`
            );

            return toast({
                title: "URL Copiada",
            });
        }
    }

    return (
        <Flex
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
                    src={imageVF}
                    style={{
                        width: "2rem",
                        height: "2rem",
                    }}
                />

                <Flex align="center">
                    <Text fontSize="small" textAlign="center" fontWeight="bold">
                        Validação Facial
                    </Text>
                </Flex>
            </Flex>

            {!retorno && (
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
                    onClick={gerarValidacaoFacial}
                    isLoading={loading}
                >
                    Consultar
                </Button>
            )}

            {retorno && (
                <Button
                    w="full"
                    variant="outline"
                    size="xs"
                    border={0}
                    borderTop="1px"
                    borderColor="#e1e8f0"
                    rounded={0}
                    py="1rem"
                    leftIcon={<Icon as={FiLink} />}
                    onClick={copiarLink}
                >
                    Copiar Link da Validação
                </Button>
            )}
        </Flex>
    );
};

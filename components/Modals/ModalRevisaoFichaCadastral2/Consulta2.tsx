import { useRef, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { Button, Flex, Icon, Image, Text, useToast } from "@chakra-ui/react";
import { apiNetrin } from "@/services/apiNetrin";
import { ModalResultadoEndereco } from "./ResultadosConsultas/Endereco/Modal";

interface TipoConsultaProps {
    consulta: any;
    cpf?: string;
    cnpj?: string;
    uf?: string;
}

const token = "fd738b33-ad1d-4cda-bd47-47ffdeefad01";

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

export const Consulta2 = ({ consulta, cpf, cnpj }: TipoConsultaProps) => {
    const toast = useToast();
    const modalResultadoEndereco = useRef();

    const [enderecos, setEnderecos] = useState<IConsultaEndereco[]>([]);

    const [consultandoNetrin, setConsultandoNetrin] = useState(false);

    const consultarNetrin = async (tipoConsulta: string) => {
        try {
            setConsultandoNetrin(true);

            if (cpf) {
                if (tipoConsulta === "endereco-cpf") {
                    const response = await apiNetrin.get(
                        `consulta-composta?token=${token}&s=${tipoConsulta}&cpf=${cpf}`
                    );

                    if (response.data)
                        setEnderecos(response.data.enderecoCPF.endereco);
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

    return (
        <Flex
            key={consulta.codigo}
            rounded="lg"
            borderWidth={1}
            p={2}
            flexDir="column"
            justify="space-between"
        >
            <Flex
                flexDir="column"
                gap={1}
                align="center"
                justify="center"
                h="full"
            >
                <Image
                    alt="Receita Federal"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Logo_Receita_Federal_do_Brasil.svg/1200px-Logo_Receita_Federal_do_Brasil.svg.png"
                    w={8}
                    h={8}
                />
                <Flex align="center" h="full">
                    <Text
                        fontSize="x-small"
                        textAlign="center"
                        fontWeight="bold"
                    >
                        {consulta?.nome}
                    </Text>
                </Flex>
            </Flex>

            <Button
                w="full"
                variant="outline"
                size="xs"
                leftIcon={<Icon as={FiSearch} />}
                onClick={() => consultarNetrin(consulta.codigo)}
                isLoading={consultandoNetrin}
            >
                Consultar
            </Button>

            {enderecos.length > 0 && (
                <Button
                    w="full"
                    variant="outline"
                    size="xs"
                    leftIcon={<Icon as={FiEye} />}
                    isLoading={consultandoNetrin}
                    onClick={() =>
                        modalResultadoEndereco?.current?.onOpen({
                            tipoResultado: "enderecos",
                            data: enderecos,
                        })
                    }
                >
                    {enderecos.length} endereços encontrados
                </Button>
            )}

            <ModalResultadoEndereco ref={modalResultadoEndereco} />
        </Flex>
    );
};

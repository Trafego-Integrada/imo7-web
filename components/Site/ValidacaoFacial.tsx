import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Image,
    Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";

export const ValidacaoFacial = () => {
    return (
        <Container maxW="container.xl" py={12}>
            <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                <Heading color="#032552" fontSize="24px" fontWeight="500">
                    Validação Facial
                </Heading>
                <Text color="#021531" fontSize="32px">
                    <strong>Mais segurança</strong> e{" "}
                    <strong>confiabilidade</strong> no processo de{" "}
                    <strong>cadastramento</strong>e{" "}
                    <strong>análise de dados</strong>
                </Text>
            </Flex>
            <Text>
                Ao incorporar a tecnologia de{" "}
                <strong>reconhecimento facial</strong>, essa funcionalidade
                <strong>garante uma camada adicional de autenticação</strong>,
                ajudando a imobiliária a{" "}
                <strong>verificar a identidade dos indivíduos</strong>
                envolvidos nas transações.
            </Text>
            <Flex
                align="center"
                gap={8}
                flexDir={{ base: "column", lg: "row" }}
            >
                <Flex flexDir="column" gap={4}>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Verificação após preenchimento de dados;
                        </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Consulta direta na Base da Receita Federal;
                        </Text>
                    </Flex>

                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Confirmação de identidade se realmente o CPF
                            pertence a foto que está sendo enviada.
                        </Text>
                    </Flex>
                    <Button
                        colorScheme="whatsapp"
                        rightIcon={<FaWhatsappSquare />}
                    >
                        Solicitar demonstração
                    </Button>
                </Flex>{" "}
                <Image src="/img/IMAGEM (2).png" alt="#" />
            </Flex>
        </Container>
    );
};

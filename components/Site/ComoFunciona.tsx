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

export const ComoFunciona = () => {
    return (
        <Container maxW="container.xl" py={12}>
            <Flex textAlign="center" mb={4} gap={4} flexDir="column">
                <Heading color="#032552" fontSize="24px" fontWeight="500">
                    Como funciona
                </Heading>
                <Text color="#021531" fontSize="32px">
                    Já imaginou ter a possibilidade do{" "}
                    <Text as="span" fontWeight="bold">
                        seu cliente fazer o trabalho
                        <br /> operacional
                    </Text>
                    e você{" "}
                    <Text as="span" fontWeight="bold">
                        não perder tempo
                    </Text>{" "}
                    com{" "}
                    <Text as="span" fontWeight="bold">
                        demandas manuais
                    </Text>
                    ?
                </Text>
            </Flex>
            <Flex align="center" gap={8}>
                <Image src="/img/IMAGEM.png" alt="#" />
                <Flex flexDir="column" gap={4}>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Preenchimento de dados cadastrais para locação,
                            compra e venda de imóveis de forma online.
                        </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Ficha responsiva, podendo ser acessada por celular,
                            computador ou tablet.
                        </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Experiência fluida, tornando os processos de
                            locação, compra e venda rápidos e eficientes.
                        </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                        <Icon
                            as={FiCheckCircle}
                            color="#77BA89"
                            fontSize={16}
                        />
                        <Text color="#021531">
                            Seu cliente poderá enviar todo o checklist de
                            documentação (cópias de CPF, RG, certidões, etc.. )
                            necessárias para locação, compra ou venda de
                            imóveis, tudo de forma online.
                        </Text>
                    </Flex>
                    <Button
                        colorScheme="whatsapp"
                        rightIcon={<FaWhatsappSquare />}
                    >
                        Solicitar demonstração
                    </Button>
                </Flex>
            </Flex>
        </Container>
    );
};

import {
    Box,
    Button,
    Container,
    Flex,
    Image,
    Input,
    Link,
    Text,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

export const Header = () => {
    return (
        <Box
            h={{ lg: "90vh" }}
            maxH={{ lg: "90vh" }}
            background="url(/img/IMAGEM-TOPO-CELULAR.png),radial-gradient(274.41% 274.41% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%),#03132B 0"
            bgRepeat="no-repeat"
            bgPos="right"
            bgSize="cover"
        >
            <Box as="nav">
                <Container
                    maxW="container.xl"
                    as={Flex}
                    justify="space-between"
                    align="center"
                    py={12}
                >
                    <Box>
                        <Image src="/img/logo-imo7-escuro.svg" alt="Imo7" />
                    </Box>
                    <Flex gap={24} align="center">
                        <Flex gap={8}>
                            <Link href="#" color="white">
                                Soluções
                            </Link>
                            <Link href="#" color="white">
                                Recursos
                            </Link>
                        </Flex>
                        <Flex>
                            <Button
                                colorScheme="whatsapp"
                                rightIcon={<FaWhatsapp />}
                                size="sm"
                            >
                                Fale Conosco
                            </Button>
                        </Flex>
                    </Flex>
                </Container>
            </Box>

            <Container maxW="container.xl" as={Flex} align="center" py={16}>
                <Flex maxW="md" flexDir="column" gap={6}>
                    <Text
                        color="white"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="normal"
                    >
                        Uma ferramenta facilitadora para o cadastramento de
                        dados nos processos de locação, compra e venda de
                        imóveis
                    </Text>
                    <Text color="white" lineHeight="24px" fontWeight="400">
                        Se o gerenciamento de dados dos seus clientes tem sido
                        um problema para sua imobiliária, o Imo7 é tudo que você
                        precisa para diminuir o retrabalho, aumentar a
                        produtividade da equipe e multiplicar os novos
                        atendimentos com muito mais eficiência!
                    </Text>
                    <Flex gap={4}>
                        <Input bg="white" placeholder="Cadastre seu e-mail" />
                        <Box>
                            <Button colorScheme="cyan">
                                Descubra a solução
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

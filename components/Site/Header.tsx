import { imo7ApiService } from "@/services/apiServiceUsage";
import { apiService } from "@/services/apiServices";
import {
    Box,
    Button,
    Container,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    IconButton,
    Image,
    Input,
    Link,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useMutation } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    nome: yup.string().required(),
});
export const Header = () => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    const toast = useToast();

    const form = useForm({
        resolver: yupResolver(schema),
    });
    const contato = useMutation(imo7ApiService("contato").create, {
        onSuccess: () => {
            window.open(
                `https://web.whatsapp.com/send?phone=+5527992747255&text=Olá, sou ${form.watch(
                    "nome"
                )},\n\n Meu e-mail é ${form.watch(
                    "email"
                )}, e meu telefone ${form.watch(
                    "telefone"
                )}\n\n Quero saber mais sobre o IMO7`
            );
        },
    });
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
                    <Flex
                        gap={24}
                        align="center"
                        display={{ base: "none", lg: "flex" }}
                    >
                        <Flex gap={8}>
                            <Link href="#como-funciona" color="white">
                                Como funciona
                            </Link>
                            <Link href="#solucoes" color="white">
                                Soluções
                            </Link>
                            <Link href="#planos" color="white">
                                Planos
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
                    <IconButton
                        display={{ base: "flex", lg: "none" }}
                        icon={<MdMenu />}
                        size="lg"
                        variant="ghost"
                        color="white"
                        onClick={onToggle}
                    />
                    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                        <DrawerOverlay />
                        <DrawerContent bg="#03132B">
                            <DrawerBody>
                                <DrawerCloseButton />
                                <Flex flexDir="column" gap={12}>
                                    <Box>
                                        <Image
                                            src="/img/logo-imo7-escuro.svg"
                                            alt="Imo7"
                                        />
                                    </Box>

                                    <Flex gap={4} flexDir="column">
                                        <Link href="#" color="white">
                                            Soluções
                                        </Link>
                                        <Link href="#" color="white">
                                            Recursos
                                        </Link>
                                        <Link href="#" color="white">
                                            Planos
                                        </Link>
                                    </Flex>
                                    <Flex flexDir="column">
                                        <Button
                                            colorScheme="whatsapp"
                                            rightIcon={<FaWhatsapp />}
                                            size="sm"
                                        >
                                            Fale Conosco
                                        </Button>
                                    </Flex>
                                </Flex>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
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
                    <Flex
                        as="form"
                        onSubmit={form.handleSubmit(
                            async (data) => await contato.mutateAsync(data)
                        )}
                        gap={4}
                        flexDir="column"
                    >
                        <Input
                            bg="white"
                            placeholder="Qual seu nome?"
                            {...form.register("nome")}
                        />
                        <Input
                            bg="white"
                            placeholder="Qual seu e-mail"
                            {...form.register("email")}
                        />
                        <Input
                            bg="white"
                            placeholder="Qual seu telefone"
                            {...form.register("telefone")}
                        />
                        <Box>
                            <Button
                                // isLoading={form.formState.isSubmitting}
                                colorScheme="cyan"
                                type="submit"
                            >
                                Descubra a solução
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

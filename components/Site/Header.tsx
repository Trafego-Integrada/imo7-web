import { imo7ApiService } from "@/services/apiServiceUsage";
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
    Grid,
    GridItem,
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
            toast({
                title: 'Solicitação de demostração realizada com sucesso.',
                status: 'success'
            })
            window.open(
                `https://web.whatsapp.com/send?phone=5519996258095&text=Olá, sou ${form.watch(
                    "nome"
                )},\n\n Meu e-mail é ${form.watch(
                    "email"
                )}, e meu telefone ${form.watch(
                    "telefone"
                )}\n\n Quero saber mais sobre o IMO7`
            );
            form.reset()
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
                            <Link target="_blank" href="https://web.whatsapp.com/send?phone=5519996258095&text=Gostaria de saber mais informações sobre o IMO7">
                            <Button
                                colorScheme="whatsapp"
                                rightIcon={<FaWhatsapp />}
                                size="sm"
                            >
                                Fale Conosco
                            </Button>
                            </Link>
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
                                        <Link target="_blank" href="https://web.whatsapp.com/send?phone=5519996258095&text=Gostaria de saber mais informações sobre o IMO7">
                                            <Button
                                                colorScheme="whatsapp"
                                                rightIcon={<FaWhatsapp />}
                                                size="sm"
                                            >
                                                Fale Conosco
                                            </Button>
                                        </Link>
                                    </Flex>
                                </Flex>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Container>
            </Box>

            <Container maxW="container.xl" as={Flex} align="center" py={8}>
                <Flex maxW="lg" flexDir="column" gap={6}>
                    <Text color="white" fontSize="32px" lineHeight="normal">
                        Sua equipe <strong>perde tempo</strong> conversando o
                        dia inteiro com os cliente no <strong>Whatsapp</strong>{" "}
                        ou você quer fechar{" "}
                        <strong>mais contratos de locação</strong>?
                    </Text>
                    <Text color="white" lineHeight="24px" fontWeight="400">
                        Se o gerenciamento de dados dos seus clientes tem sido
                        um problema para sua imobiliária, o Imo7 é tudo que você
                        precisa para diminuir o retrabalho, aumentar a
                        produtividade da equipe e multiplicar os novos
                        atendimentos com muito mais eficiência!
                    </Text>
                    <Grid
                        as="form"
                        onSubmit={form.handleSubmit(
                            async (data) => await contato.mutateAsync(data)
                        )}
                        gap={4}
                        flexDir="column"
                        gridTemplateColumns={{ lg: "repeat(2,1fr)" }}
                    >
                        <GridItem colSpan={{ lg: 2 }}>
                            <Input
                                size="sm"
                                bg="white"
                                placeholder="Qual seu nome?"
                                {...form.register("nome")}
                            />
                        </GridItem>
                        <GridItem>
                            <Input
                                size="sm"
                                bg="white"
                                placeholder="Qual seu e-mail"
                                {...form.register("email")}
                            />
                        </GridItem>
                        <GridItem>
                            <Input
                                size="sm"
                                bg="white"
                                placeholder="Qual seu telefone"
                                {...form.register("telefone")}
                            />
                        </GridItem>
                        <GridItem colSpan={{ lg: 2 }} textAlign="right">
                            <Button size="sm" colorScheme="cyan" type="submit">
                                Descubra a solução
                            </Button>
                        </GridItem>
                    </Grid>
                </Flex>
            </Container>
        </Box>
    );
};

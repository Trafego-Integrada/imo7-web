import { imo7ApiService } from "@/services/apiServiceUsage";
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Icon,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { BiAlarm } from "react-icons/bi";
import { useMutation } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    nome: yup.string().required("Campo obrigatório"),
    email: yup.string().required("Campo obrigatório"),
    telefone: yup.string().required("Campo obrigatório"),
    mensagem: yup.string().required("Campo obrigatório"),
});
export const Footer = () => {
    const toast = useToast();
    const form = useForm({
        resolver: yupResolver(schema),
    });
    const contato = useMutation(imo7ApiService("contato").create, {
        onSuccess: () => {
            toast({
                title: "Mensagem enviada com sucesso",
                status: "success",
            });
            form.reset({});
        },
    });
    return (
        <Box bg="#F6FDFF" py={24}>
            <Container maxW="container.xl">
                <Grid gap={6} gridTemplateColumns={{ lg: "repeat(3,1fr)" }}>
                    <GridItem w="sm">
                        <Heading
                            mb={4}
                            fontWeight="700"
                            fontStyle="normal"
                            fontSize="32px"
                        >
                            Entrar em contato
                        </Heading>
                        <Text>
                            Envie uma mensagem pra gente e vamos dar um retorno
                            assim que possível!
                        </Text>
                    </GridItem>
                    <GridItem
                        w="full"
                        as="form"
                        onSubmit={form.handleSubmit(
                            async (data) => await contato.mutateAsync(data)
                        )}
                    >
                        <Grid
                            gridTemplateColumns={{ lg: "repeat(2,1fr)" }}
                            gap={4}
                        >
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Nome
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="Digite seu nome completo"
                                        {...form.register("nome")}
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        E-mail
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="email@email.com.br"
                                        {...form.register("email")}
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Telefone de contato
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="(99) 99999-6666"
                                        {...form.register("telefone")}
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }}>
                                <FormControl>
                                    <FormLabel
                                        color="#021531"
                                        fontWeight="bold"
                                    >
                                        Mensagem
                                    </FormLabel>
                                    <Input
                                        bg="white"
                                        borderColor="#4B4B4B"
                                        placeholder="Olá, gostaria de mais informações sobree o Imo7"
                                        {...form.register("mensagem")}
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={{ lg: 2 }} textAlign="center">
                                <Button type="submit">Enviar mensagem</Button>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem w="sm">
                        <Flex mb={4} gap={2} align="center">
                            <Icon as={BiAlarm} fontSize="2xl" />
                            <Heading
                                fontWeight="700"
                                fontStyle="normal"
                                fontSize="32px"
                            >
                                Atendimento
                            </Heading>
                        </Flex>
                        <Text>De segunda a sexta-feira das 08 às 17 horas</Text>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};

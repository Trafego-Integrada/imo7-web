import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Text,
} from "@chakra-ui/react";
import { BsChat } from "react-icons/bs";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";

export const ComoFunciona3 = () => {
    return (
        <Container
            maxW="container.xl"
            pt={{ lg: 12 }}
            py={{ base: 12, lg: 48 }}
        >
            <Grid gridTemplateColumns={{ lg: "repeat(2,1fr)" }}>
                <GridItem>
                    <Heading size="xl" color="#021531" fontWeight="normal">
                        <strong> Economize tempo </strong>e deixe tudo mais
                        <strong>fácil</strong> para a sua equipe e para o seu
                        cliente. Com o IMO7, o gerenciamento de dados{" "}
                        <strong>nunca foi tão fácil!</strong>
                    </Heading>
                    <Text my={4}>
                        Ninguém merece mais em pleno século 21 ficar enviando
                        documento via WhatsApp. Se sua imobiliária faz isso,
                        então você está parado no tempo! Com o IMO7 você agiliza
                        todo o processo burocrático deixando ele mais leve e
                        simples para sua equipe e clientes.
                    </Text>
                    <Button
                        colorScheme="whatsapp"
                        rightIcon={<FaWhatsappSquare />}
                    >
                        Solicitar demonstração
                    </Button>
                </GridItem>
            </Grid>
        </Container>
    );
};

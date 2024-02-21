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
    Link,
    Text,
} from "@chakra-ui/react";
import { BsChat } from "react-icons/bs";
import { FaCheckCircle, FaWhatsappSquare } from "react-icons/fa";
import { FiCheckCircle, FiCheckSquare } from "react-icons/fi";

export const ComoFunciona3 = ({ modal }) => {
    return (
        <Container
            maxW="container.xl"
            pt={{ lg: 12 }}
            py={{ base: 12, lg: 48 }}
        >
            <Grid gridTemplateColumns={{ lg: "repeat(2,1fr)" }} gap={4}>
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
                        onClick={() => modal.current.onOpen()}
                        colorScheme="whatsapp"
                        rightIcon={<FaWhatsappSquare />}
                    >
                        Solicitar demonstração
                    </Button>
                </GridItem>
                <GridItem>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/5DT15ikoniQ?si=bOZ4tzyD0ZjLJe_K"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </GridItem>
            </Grid>
        </Container>
    );
};

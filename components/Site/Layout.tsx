import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Image,
    Link,
    List,
    ListItem,
    Text,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

export const LayoutSite = ({ children }) => {
    return (
        <Box>
            <Box as="main">{children}</Box>
            <Box as="footer">
                <Container maxW="container.xl" py={12}>
                    <Grid gridTemplateColumns={{ lg: "repeat(5,1fr)" }}>
                        <GridItem>
                            <Image src="/img/LOGO-IMO7-FUNDO-CLARO 1.png" />
                        </GridItem>
                    </Grid>
                </Container>
                <Divider />
                <Container maxW="container.xl" py={6}>
                    <Flex justify="space-between">
                        <Text>Imo7 202 Todos os direitos reservador</Text>
                        <Flex gap={4}>
                            <Text>Política de privacidade</Text>
                            <Text>Termos de uso</Text>
                        </Flex>
                    </Flex>
                    <Text textAlign="center">
                        CNPJ 08.334.297/0001-33 - Trafego Acesso a Internet
                        Eireli, Rua Nove de Julho, 508 -sala 07 - Americana - SP
                    </Text>
                </Container>
            </Box>
        </Box>
    );
};

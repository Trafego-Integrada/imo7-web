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
                        <GridItem>
                            <Text fontWeight="bold">IMO7</Text>
                            <List>
                                <ListItem>Sobre</ListItem>
                                <ListItem>Sobre</ListItem>
                                <ListItem>Sobre</ListItem>
                            </List>
                        </GridItem>
                        <GridItem>
                            <Text fontWeight="bold">Central de ajuda</Text>
                            <List>
                                <ListItem>Base de conhecimento</ListItem>
                            </List>
                        </GridItem>
                        <GridItem>
                            <Text fontWeight="bold">Produtos</Text>
                            <List>
                                <ListItem>Portal Tráfego Imóveis</ListItem>
                                <ListItem>API</ListItem>
                                <ListItem>Integrações</ListItem>
                            </List>
                        </GridItem>
                    </Grid>
                </Container>
                <Divider />
                <Container maxW="container.xl" py={6}>
                    <Flex justify="space-between">
                        <Text>Imo7 2023 Todos os direitos reservador</Text>
                        <Flex gap={4}>
                            <Text>Política de privacidade</Text>
                            <Text>Termos de uso</Text>
                        </Flex>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

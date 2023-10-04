import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";

export const Clientes = () => {
    return (
        <Box
            bg="radial-gradient(146.68% 146.68% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%), #021838"
            py={12}
        >
            <Container maxW="container.xl">
                <Flex flexDir="column" gap={8}>
                    <Heading textAlign="center" fontWeight="400" color="white">
                        Conheça nossos <strong>clientes</strong>
                    </Heading>
                    <Flex justify="center" gap={4}>
                        <Image src="/img/WPA-01 1.png" objectFit="contain" />
                        <Image src="/img/CARVALHO.png" objectFit="contain" />
                        <Image src="/img/IMPERIUM.png" objectFit="contain" />
                        <Image src="/img/BUENO.png" objectFit="contain" />
                        <Image src="/img/JMATINS.png" objectFit="contain" />
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

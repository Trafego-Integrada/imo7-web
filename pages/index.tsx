import { Head } from "../components/Head";

import { Flex, Heading } from "@chakra-ui/react";

export default function Home() {
    return (
        <div>
            <Head title="Imo7"></Head>

            <Flex
                w="100vw"
                h="100vh"
                bg="blue.500"
                align="center"
                justify="center"
            >
                <Heading color="white">Em breve novidades</Heading>
            </Flex>
        </div>
    );
}

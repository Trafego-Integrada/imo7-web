import { Box, Flex } from "@chakra-ui/react";
import { Menulateral } from "@/components/Menu/Menulateral";
import { Menutopo } from "@/components/Menu/Menutopo";

export const Layout = ({ title, subtitle, children }) => {
    return (
        <Box minH="100vh" h="full" bg="gray.200">
            <Flex h="full">
                <Menulateral />
                <Box width={{ base: "100vw", md: "calc(100vw - 100px)" }}>
                    <Menutopo namepage={title} subnamepage={subtitle} />
                    <Box bg="gray.200">{children}</Box>
                </Box>
            </Flex>
        </Box>
    );
};

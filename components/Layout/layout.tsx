import { Box, Flex } from "@chakra-ui/react";
import { Menulateral } from "@/components/Menu/Menulateral";
import { Menutopo } from "@/components/Menu/Menutopo";

export const Layout = ({ title, subtitle, children }) => {
    return (
        <Box minH="100vh" bg="gray.200">
            <Flex>
                <Menulateral />
                <Menutopo namepage={title} subnamepage={subtitle} />
            </Flex>
            <Box
                h="full"
                bg="gray.200"
                ml={{ base: "0px", md: "100px" }}
                w={{ sm: "", md: "calc(100% - 100px)" }}
            >
                {children}
            </Box>
        </Box>
    );
};

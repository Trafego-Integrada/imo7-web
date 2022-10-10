import { Box, Flex } from "@chakra-ui/react";
import { Menulateral } from "../Menu/Menulateral";
import { Menutopo } from "../Menu/Menutopo";

export const Layout = ({ title, subtitle, children }) => {
    return (
        <Box minH="100vh    ">
            <Flex>
                <Menulateral />
                <Menutopo namepage={title} subnamepage={subtitle} />
            </Flex>
            <Box
                h="full"
                bg="gray.100"
                ml={{ base: "0px", md: "120px" }}
                w={{ sm: "", md: "calc(100% - 120px)" }}
            >
                {children}
            </Box>
        </Box>
    );
};

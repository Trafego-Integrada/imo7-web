import { Box } from "@chakra-ui/react";
import { Listagemmenu } from "./Listagemmenu";
import { Logo } from "./Logo";

export const Menulateral = () => {
    return (
        <Box
            w="100px"
            h="full"
            minH="100vh"
            bg="graydark"
            display={{ base: "none", md: "flex" }}
            flexDirection={"column"}
            zIndex="2"
        >
            <Logo />
            <Listagemmenu />
        </Box>
    );
};

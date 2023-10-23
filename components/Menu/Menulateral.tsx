import { Box } from "@chakra-ui/react";
import { Listagemmenu } from "./Listagemmenu";
import { Logo } from "./Logo";

export const Menulateral = () => {
    return (
        <Box
            w="100px"
            h="full"
            minH="100vh"
            bg="radial-gradient(274.41% 274.41% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%), #03132B;"
            display={{ base: "none", md: "flex" }}
            flexDirection={"column"}
            zIndex="2"
        >
            <Logo />
            <Listagemmenu />
        </Box>
    );
};

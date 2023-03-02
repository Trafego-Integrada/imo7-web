import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => {
    return (
        <>
            <Link href="./">
                <Box
                    zIndex={10}
                    borderBottom="1px solid rgba(255,255,255,0.2)"
                    minH="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                >
                    <Flex fontSize="2xl" fontWeight="bold" letterSpacing="2px">
                        <Text color="white">Imo</Text>
                        <Text color="orange">7</Text>
                    </Flex>
                </Box>
            </Link>
        </>
    );
};

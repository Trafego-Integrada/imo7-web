import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => {
    return (
        <>
            <Link href="/admin" passHref>
                <Box
                    zIndex={10}
                    borderBottom="1px solid rgba(255,255,255,0.2)"
                    minH={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
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

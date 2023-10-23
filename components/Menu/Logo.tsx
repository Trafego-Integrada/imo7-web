import { Box, Flex, Image, Text } from "@chakra-ui/react";
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
                    p={4}
                >
                    <Image src="/img/logo-imo7-escuro.svg" />
                </Box>
            </Link>
        </>
    );
};

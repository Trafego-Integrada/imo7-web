import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Spinner } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { NextChakraLink } from "./NextChakraLink";

export const Header = ({ title, isFetching, children }) => {
    const { usuario } = useAuth();
    return (
        <Flex>
            <Flex w="full" h={12} justify="space-between" align="center" px={4}>
                <Box>
                    <Flex gridGap={2} align="center">
                        <Text
                            fontWeight="semibold"
                            fontSize="2xl"
                            color="gray.600"
                        >
                            {title}
                        </Text>
                        {isFetching && <Spinner size="sm" />}
                    </Flex>

                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

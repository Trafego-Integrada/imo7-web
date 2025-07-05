import { useAuth } from '@/hooks/useAuth'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'

export const Header = ({ title, isFetching, children }) => {
    const { usuario } = useAuth()
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
    )
}

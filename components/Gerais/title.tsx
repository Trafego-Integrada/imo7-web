import { Text } from "@chakra-ui/react"

export const Title = ({ children }) => {
    return <>
        <Text mb={5} mt={5} fontSize='2xl' fontWeight='600' >{children}</Text>
    </>
}
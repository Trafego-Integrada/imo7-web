// components/ErrorPage.tsx
import { Box, Heading, Text, Flex } from '@chakra-ui/react';

export const ErrorPage = () => {
  return (
    <Box textAlign="center" mt="10">
        <Heading as="h1" fontSize="4xl" mb="4">
            Ocorreu um erro
        </Heading>
        <Text fontSize="xl">
            Desculpe-nos, algo deu errado. Procure nossa equipe de suporte para solucionarmos o transtorno o quanto antes.
        </Text>
    </Box>
  );
};
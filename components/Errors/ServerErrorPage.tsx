// components/ErrorPage.tsx
import { Box, Heading, Text, List, ListItem } from '@chakra-ui/react';

export const ErrorPage = () => {
  return (
    <Box textAlign="center" mt="10">
      <Heading as="h1" fontSize="4xl" mb="4">
        Desculpe, ocorreu um erro inesperado.
      </Heading>
      <Text fontSize="xl" mb="8">
        Por favor, verifique as informações fornecidas e tente novamente mais tarde.
      </Text>
      <Box textAlign="left" mx="auto" maxW="xl">
        <Text fontSize="lg" mb="4" fontWeight="bold">
          Possíveis Causas:
        </Text>
        <List spacing={3}>
          <ListItem fontSize="md">
            Ficha Vazia: A ficha que você está tentando acessar parece estar vazia. Isso pode ocorrer se nenhum arquivo foi enviado para preencher os dados associados à ficha. Certifique-se seu cliente fez o upload dos arquivos necessários para visualizar as informações corretamente.
          </ListItem>
          <ListItem fontSize="md">
            Ficha Deletada: A ficha que você está tentando acessar foi deletada do sistema. Isso pode ter sido resultado de uma ação deliberada ou de uma exclusão acidental.
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
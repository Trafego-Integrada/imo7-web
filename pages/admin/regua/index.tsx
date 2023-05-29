import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { Box, Table, Thead, Th, Tbody, Tr, Td, Button } from "@chakra-ui/react";
const Regua = ()=>{
    return(<Layout title={"Regua"} subtitle={"Regras para notificações"}>
        <Box p={5}>
            <Box p={5} mt={20}>
                <Button size="sm" colorScheme='blue'>Adicionar</Button>
            </Box>
            <Box p={5} mt={5} bg={"white"} borderRadius={20}>
                <Table variant="striped" mt={5} bg="white">
                    <Thead>
                        <Th>Tio de Envio</Th>
                        <Th>Referenia de dias</Th>
                        <Th>Assunto</Th>
                        <Th>Mensagem</Th>
                        <Th>Hora de Envio</Th>
                        <Th>Ações</Th>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>   
                            <Td></Td>   
                        </Tr>
                    </Tbody>
                </Table>

            </Box>
        </Box>
    </Layout>
    );
}
export default Regua;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);
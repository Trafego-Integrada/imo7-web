import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {useRef}from "react";
import { Box, Table, Thead, Th, Tbody, Tr, Td, Button, Modal, useDisclosure, toast } from "@chakra-ui/react";
import { BiPlusMedical } from "react-icons/bi";
import { ModalRegua } from "@/components/Modals/Regua";
import { useMutation, useQuery } from "react-query";
import { atualizarRegua, cadastrarRegua, listaregras } from "@/services/models/regua";
import { queryClient } from "@/services/queryClient";

const Regua = ()=>{
    const modal = useRef()
    const { data:reg} = useQuery("regua", listaregras)

     
      

    return(<Layout title={"Regua"} subtitle={"Regras para notificações"}>
        <Box p={5}>
            <Box p={5} mt={20}>
                <Button size="sm" colorScheme='blue' onClick={() => modal.current.onOpen()}>
                    Adicionar
                </Button>
            </Box>
            <Box p={5} mt={5} bg={"white"} borderRadius={20}>
                <Table variant="striped" mt={5} bg="white" borderRadius={20}>
                    <Thead>
                        <Th>Tipo de Envio</Th>
                        <Th>Referencia de dias</Th>
                        <Th>Assunto</Th>
                        <Th>Mensagem</Th>
                        <Th>Hora de Envio</Th>
                        <Th>Ações</Th>
                    </Thead>
                    <Tbody>
                        {reg?.data?.map(r => (
                            <Tr>
                                <Td>{r.tipoEnvio.descricao}</Td>
                                <Td>{r.diasReferencia}</Td>
                                <Td>{r.assunto}</Td>
                                <Td>{r.mensagem}</Td>
                                <Td>{r.horaEnvio}</Td>
                                <Td>
                                    <Button size="sm" colorScheme="blue">Editar</Button>
                                    <Button size="sm" colorScheme="red" ml={5}>Excluir</Button>
                                </Td>
                            </Tr>
                        ))}
                       
                    </Tbody>
                </Table>

            </Box>
        </Box>
        <ModalRegua  ref={modal}/>
        
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
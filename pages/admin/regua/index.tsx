import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {useRef}from "react";
import { Box, Table, Thead, Th, Tbody, Tr, Td, Button, Modal, useDisclosure, toast, Spinner, useToast } from "@chakra-ui/react";
import { BiPlusMedical } from "react-icons/bi";
import { ModalRegua } from "@/components/Modals/Regua";
import { useMutation, useQuery } from "react-query";
import { atualizarRegua, cadastrarRegua, excluirRegua, listaregras } from "@/services/models/regua";
import { queryClient } from "@/services/queryClient";
import { InferGetServerSidePropsType } from "next";

const Regua = (props: InferGetServerSidePropsType<typeof getServerSideProps>)=>{
    const modal = useRef()
    const toast = useToast();
    const { data:reg, isLoading, isFetching} = useQuery("regua", listaregras)

  const excluir = useMutation(excluirRegua,{
    onSuccess: () => {
        toast({
                    title: "Regua excluido",
                    duration: 3000,
                    status: "success",
                });
                queryClient.invalidateQueries(["regua"]);
    }
  })

    const onDelete = async (id) => {
        await excluir.mutateAsync(id);
    };

     
      

    return(<Layout title={"Regua"} subtitle={"Regras para notificações"}>
        <Box p={5}>
            <Box p={5} textAlign={'right'}  bg={'white'} borderRadius={20}>
                
                
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
                        {isLoading && (
                            <Tr> 
                                <Td><Spinner/></Td>
                            </Tr>
                        )}
                        {reg?.data?.map(r => (
                            <Tr>
                                <Td>{r.tipoEnvio.descricao}</Td>
                                <Td>{r.diasReferencia}</Td>
                                <Td>{r.assunto}</Td>
                                <Td>{r.mensagem}</Td>
                                <Td>{r.horaEnvio}</Td>
                                <Td>
                                    <Button 
                                        size="sm" 
                                        colorScheme="blue"
                                        onClick={() => modal.current.onOpen(r.id)}>
                                            Editar
                                    </Button>
                                    <Button size="sm" colorScheme="red" ml={5}
                                    
                                    onClick={() => onDelete(r.id)}
                                    >Excluir</Button>
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
import { tipoNotificacao } from "@/services/models/tipoEnvio"
import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Flex, Input, Textarea, Grid, GridItem, Select, toast, useToast } from "@chakra-ui/react"
import { forwardRef, useImperativeHandle } from "react"
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query"
import InputMask from "react-input-mask"
import { atualizarRegua, buscar, cadastrarRegua } from "@/services/models/regua";
import { queryClient } from "@/services/queryClient";


const ModalBase = ({idRegra}, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data } = useQuery("tipoEnvioNotificacao", tipoNotificacao)

     const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();


    const buscarRegua = useMutation(buscar, {
        onSuccess: (data) => {
            reset(data);
            onOpen();
        },
    });

     const cadastrar = useMutation(cadastrarRegua, {
        onSuccess: () => {
            queryClient.invalidateQueries(["regua"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarRegua, {
        onSuccess: () => {
            queryClient.invalidateQueries(["regua"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

     const onSubmit = async (data) => {
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync({ ...data, idRegra });
            }
        } catch (error) {
            toast({ title: "Ocorreu um erro", status: "error" });
        }
    };

    
    useImperativeHandle(ref, () => ({
        onOpen: () => {
            onOpen();
        },
    }));

    return <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
            <ModalContent >
          <ModalHeader>Regua</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Grid templateColumns='repeat(6, 1fr)' gap="10" mb="6"  as="form"
                            id="formRegua"
                            onSubmit={handleSubmit(onSubmit)}>
                    <GridItem colSpan="3">
                         <FormControl isRequired>
                    <FormLabel>Tipo de Envio</FormLabel>
                        <Select placeholder='Selecione' {...register("tipo")}>
                        {data?.data.map(tp => (
                            <option value={tp.id}>{tp.descricao}</option>
                        ))}

                        </Select>
                </FormControl>
                    </GridItem>
                   
                <GridItem colSpan="3" >
                <FormControl isRequired>
                    <FormLabel>Dias de referencia</FormLabel>
                        <Input {...register("dias")}/>
                </FormControl>
                </GridItem>
                <GridItem colSpan="6">

                <FormControl isRequired>
                    <FormLabel>Assunto</FormLabel>
                        <Input {...register("assunto")}/>
                </FormControl>
                </GridItem>
                <GridItem colSpan="6">

                <FormControl isRequired>
                    <FormLabel>Mensagem</FormLabel>
                        <Textarea placeholder='escreva aqui...' {...register("mensagem")} />
                </FormControl>
                </GridItem>
                <GridItem colSpan="3">
                <FormControl>
                    <FormLabel>Hora do envio</FormLabel>
                        <Input as={InputMask} mask="99:99"placeholder='00:00' {...register("hora")} />
                </FormControl>
                </GridItem>
                <GridItem textAlign="right" colSpan="3">
                    
                </GridItem>
                  
                </Grid>
                 <ModalFooter>
                            <Button type='submit' colorScheme="blue" mt="8" form="formRegua"  isLoading={isSubmitting}>Salvar</Button>
                </ModalFooter>
             
          </ModalBody>
        </ModalContent>
    </Modal>
}

export const ModalRegua = forwardRef(ModalBase)
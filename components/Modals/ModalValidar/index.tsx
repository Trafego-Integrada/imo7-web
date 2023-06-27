import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { listarCategoriaCampoFichas } from "@/services/models/categoriaCampoFicha";
import { atualizarFicha, buscarFicha, cadastrarFicha } from "@/services/models/fichaCadastral";
import { listarFichas } from "@/services/models/modeloFicha";
import { queryClient } from "@/services/queryClient";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiDownload, FiEye } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { ModalPreview } from "../Preview";
import { AnaliseCampo } from "./AnaliseCampo";

import React, { useState } from 'react';

import Webcam from "react-webcam";

const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "user"
};
  

const schema = yup.object({});

const ModalBase = ({}, ref) => {

    // STEPS 

    const [step, setStep] = useState(1);

    // TABS 

    const [tabIndex, setTabIndex] = useState(0)

    const handleSliderChange = (event) => {
        setTabIndex(parseInt(event.target.value, 10))
    }

    const handleTabsChange = (index) => {
        setTabIndex(index)
    }

    // OTHERS 
    
    const preview = useRef();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();

    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        // formState: { errors, isSubmitting },
    } = useForm();

    const {
        register: registerStep1,
        control: controlStep1,
        watch: watchStep1,
        handleSubmit: handleSubmitStep1,
        reset: resetStep1,
        formState: { 
                    errors,
                    isLoading,
                    isSubmitting,
                    isSubmitted,
                    isSubmitSuccessful
        }
    } = useForm();

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const onSubmitStep1 = async (data) => {

        alert("OnSubmitStep1");
        console.log("OnSubmitStep1"); 
        console.log("isLoading = " + isLoading);
        console.log("isSubmitting = " + isSubmitting);
        console.log("isSubmitted = " + isSubmitted);
        console.log("isSubmitSuccessful = " + isSubmitSuccessful);
        toast({ title: "Start", status: "success" });
        await timeout(2000);
        toast({ title: "End", status: "success" });

        // try {
        //     if (data.id) {
        //         await atualizar.mutateAsync(data);
        //         onClose();
        //         toast({ title: "Ficha Cadastrada", status: "success" });
        //         queryClient.invalidateQueries(["fichas"]);
        //     } else {
        //         await cadastrar.mutateAsync(data);
        //         onClose();
        //         toast({ title: "Ficha atualizada", status: "success" });
        //         queryClient.invalidateQueries(["fichas"]);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }

        // setStep(2);
        setTabIndex(1);
    };



    const buscar = useMutation(buscarFicha, {
        onSuccess: (data) => {
            reset(data);
        },
    });

    const cadastrar = useMutation(cadastrarFicha);
    const atualizar = useMutation(atualizarFicha);


    const { data: modelos } = useQuery(["modelosFichas"], listarFichas);
    const { data: campos } = useQuery(
        ["categoriasCampos", { tipoFicha: watch("modelo.tipo") }],
        listarCategoriaCampoFichas
    );

    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
      },
      [webcamRef]
    );
    
    useImperativeHandle(ref, () => ({
        onOpen: (id = null) => {
            reset({});
            if (id) {
                buscar.mutateAsync(id);
                onOpen();
            } else {
                onOpen();
            }
        },
    }));

    const data = {
        "iss": "biovalid",
        "iat": 1640018565,
        "exp": 1640020365,
        "aud": "mock",
        "sub": "29752304869",
        "filiacao": {},
        "cnh": {
          "categoria": false,
          "numero_registro": false,
          "data_validade": false
        },
        "documento": {},
        "endereco": {},
        "cpf_disponivel": true,
        "biometria_face": {
          "disponivel": true,
          "probabilidade": "Baixa probabilidade",
          "similaridade": 0.3834376618690258
        },
        "token": "2TH1EBHE4",
        "selo_biometrico": "A",
        "data_prova_de_vida": "20/12/2021 13:41:41",
        "kba_cliente_valido": false
      }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Validar Ficha Cadastral</ModalHeader>
                <ModalBody >
                    <Tabs index={tabIndex} onChange={handleTabsChange}>
                        <TabList>
                            {watch("id") && <Tab>Verificar dados</Tab>}
                            <Tab>Verificar foto</Tab>
                            <Tab>Resultado</Tab>
                        </TabList>
                        <TabPanels
                                
                            >
                            <TabPanel px={0}>
                                <form
                                    id="formStep1"
                                    onSubmit={handleSubmitStep1(onSubmitStep1)}
                                >
                                <Box bg="white" p={0} rounded="lg">
                                    <Grid gap={4}>
                                        {campos?.data
                                            ?.filter((i) =>
                                                i.campos.find(
                                                    (e) =>
                                                        watch(
                                                            `modelo.campos.${e.codigo}`
                                                        )?.exibir
                                                )
                                            )
                                            .map((item) => (
                                                <Box
                                                    key={item.id}
                                                    bg="gray.100"
                                                    p={0}
                                                >
                                                    <Heading size="sm">
                                                        {item.nome}
                                                    </Heading>
                                                    <Grid
                                                        mt={0}
                                                        gridTemplateColumns={{
                                                            base: "repeat(1,1fr)",
                                                            lg: "repeat(5,1fr)",
                                                        }}
                                                        gap={0}
                                                    >
                                                        {item?.campos?.map(
                                                            (i) => (
                                                                <GridItem
                                                                    key={i.id}
                                                                    colSpan={ i.colSpan } >
                                                                    <Flex
                                                                        align="center"
                                                                        gap={''}>
                                                                        <Text fontSize="sm">
                                                                            {i.nome}
                                                                        </Text>
                                                                    </Flex>
                                                                    <Text
                                                                        fontSize="sm"
                                                                        fontWeight="bold"
                                                                    >
                                                                        {i.tipoCampo ==
                                                                        "file" ? (
                                                                            <Flex>
                                                                                {watch(
                                                                                    "preenchimento"
                                                                                )?.find(
                                                                                    (
                                                                                        p
                                                                                    ) =>
                                                                                        p.campoFichaCadastralCodigo ==
                                                                                        i.codigo
                                                                                )
                                                                                    ?.valor ? (
                                                                                    <>
                                                                                        <Text as="span">
                                                                                            Arquivo
                                                                                            anexado
                                                                                        </Text>
                                                                                    </>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                                
                                                                            </Flex>
                                                                        ) : (
                                                                            <>
                                                                                <Flex
                                                                                    align="center"
                                                                                    gap={0}
                                                                                >
                                                                                    {i.tipoCampo ==
                                                                                    "date"
                                                                                        ? moment(
                                                                                              watch(
                                                                                                  "preenchimento"
                                                                                              )?.find(
                                                                                                  (
                                                                                                      p
                                                                                                  ) =>
                                                                                                      p.campoFichaCadastralCodigo ==
                                                                                                      i.codigo
                                                                                              )
                                                                                                  ?.valor
                                                                                          ).format(
                                                                                              "DD/MM/YYYY"
                                                                                          )
                                                                                        : watch(
                                                                                              "preenchimento"
                                                                                          )?.find(
                                                                                              (
                                                                                                  p
                                                                                              ) =>
                                                                                                  p.campoFichaCadastralCodigo ==
                                                                                                  i.codigo
                                                                                          )
                                                                                              ?.valor}
                                                                                   
                                                                                </Flex>
                                                                            </>
                                                                        )}
                                                                    </Text>
                                                                </GridItem>
                                                            )
                                                        )}
                                                    </Grid>
                                                </Box>
                                            ))}
                                        
                                        {watch("status") == "reprovada" && (
                                            <GridItem>
                                                <FormTextarea
                                                    label="Motivo da Reprovação"
                                                    placeholder="Digite o motivo..."
                                                    error={
                                                        errors.motivoReprovacao
                                                            ?.message
                                                    }
                                                    {...register(
                                                        "motivoReprovacao"
                                                    )}
                                                />
                                            </GridItem>
                                        )}
                                    </Grid>
                                </Box>
                                <ModalFooter gridGap={4} pt={4}>
                                    <br/><br/>
                                    <Button onClick={() => onClose()}>Desistir</Button>
                                    <Button
                                        colorScheme="blue"
                                        variant="solid"
                                        type="button"
                                        onClick={() => setTabIndex(1)}
                                        
                                    >
                                        AVANÇAR
                                    </Button>
                                </ModalFooter>
                                </form>
                            </TabPanel>
                            <TabPanel px={1} alignContent={"center"}>

                                  
                                    <>
                                    {tabIndex == 1 && 
                                    <Webcam
                                        audio={false}
                                        height={180}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width={320}
                                        videoConstraints={videoConstraints}
                                        style={{margin: "0 auto"}}
                                    />
                                    }
                                    <br/>
                                    <div class="center">
                                    <Button  style={{margin: "0 auto",  display: "flex"}}  colorScheme="blue" variant="solid" onClick={capture}> TIRAR FOTO</Button>
                                                        </div>

                                    <br/><br/>
                                                    
                                    <ModalFooter gridGap={4} pt={4}>
                                        <br/><br/>
                                        <Button onClick={() => onClose()}>Desistir</Button>
                                        <Button
                                            colorScheme="blue"
                                            variant="solid"
                                            isLoading={isSubmitting}
                                            type="submit"
                                            form="formStep1"
                                        >
                                            ENVIAR
                                        </Button>

                                        <Button
                                        colorScheme="blue"
                                        variant="solid"
                                        type="button"
                                        onClick={() => setTabIndex(2)}
                                        
                                        >
                                        AVANÇAR
                                    </Button>

                                    </ModalFooter>
                                
                                    </>

                            </TabPanel>
                            <TabPanel px={1}>
<h1>Resultado</h1>
<pre>{JSON.stringify(data, null, 2) }</pre>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                {/* 
                <ModalFooter gridGap={4}>
                    <Button onClick={() => onClose()}>Desistir</Button>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        isLoading={isSubmitting}
                        type="submit"
                        form="formRevisarFichaCadastral"
                    >
                        Salvar
                    </Button>
                </ModalFooter> 
                */}
            </ModalContent>
            <ModalPreview ref={preview} />
        </Modal>
    );
};

export const ModalValidar = forwardRef(ModalBase);

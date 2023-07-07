import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    Image,
    Stack,
    Text,
    VStack,
    Container,
    Card,
    CardBody,
    CardFooter,
    Divider,
    ButtonGroup,
    Center,
} from "@chakra-ui/react";

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from "@chakra-ui/react";

import { FormInput } from "@/components/Form/FormInput";
import prisma from "@/lib/prisma";
import Head from 'next/head'

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { withSSRGuest } from "@/utils/withSSRGuests";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdFingerprint } from "react-icons/md";
import { Input } from "@/components/Forms/Input";
import { FaFacebook, FaGoogle, FaSignInAlt } from "react-icons/fa";
import { CgPassword } from "react-icons/cg";
import BeatLoader from "react-spinners/BeatLoader";
import { NextPage } from "next";
import { Heading } from "@chakra-ui/layout";
import { NextChakraLink } from "@/components/NextChakraLink";
import { api } from "@/services/apiClient";
import { useRouter } from "next/router";

import Webcam from "react-webcam";
import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";



/*!
 *	Gerador e Validador de CPF v1.0.0
 *	https://github.com/tiagoporto/gerador-validador-cpf
 *	Copyright (c) 2014-2015 Tiago Porto (http://www.tiagoporto.com)
 *	Released under the MIT license
 */
function CPF() {
    "user_strict";
    function r(r) {
        for (var t = null, n = 0; 9 > n; ++n)
            t += r.toString().charAt(n) * (10 - n);
        var i = t % 11;
        return (i = 2 > i ? 0 : 11 - i);
    }
    function t(r) {
        for (var t = null, n = 0; 10 > n; ++n)
            t += r.toString().charAt(n) * (11 - n);
        var i = t % 11;
        return (i = 2 > i ? 0 : 11 - i);
    }
    var n = "CPF Inválido",
        i = "CPF Válido";
    (this.gera = function () {
        for (var n = "", i = 0; 9 > i; ++i)
            n += Math.floor(9 * Math.random()) + "";
        var o = r(n),
            a = n + "-" + o + t(n + "" + o);
        return a;
    }),
        (this.valida = function (o) {
            for (
                var a = o.replace(/\D/g, ""),
                    u = a.substring(0, 9),
                    f = a.substring(9, 11),
                    v = 0;
                10 > v;
                v++
            )
                if (
                    "" + u + f ==
                    "" + v + v + v + v + v + v + v + v + v + v + v
                )
                    return n;
            var c = r(u),
                e = t(u + "" + c);
            return f.toString() === c.toString() + e.toString() ? i : n;
        });
}

function cpfMask(v) {
    if (typeof v === "undefined") return;
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
}

const ValidacaoFacial: NextPage = ({ imobiliaria }) => {

    const router                            = useRouter();
    const [photo, setPhoto]                 = useState();
    const [windowStatus, setWindowStatus]   = useState(null);
    const [step, setStep]                   = useState(1);

    const [streamWidth, setStreamWidth]      = useState();
    const [streamHeight, setStreamHeight]    = useState();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        // document.querySelector("meta[name=viewport]").setAttribute(
        //     'content', 
        //     'width=device-width, initial-scale=1');
        // check();
        checkResolution();
        setWindowStatus(1);
    }, []);

    const [error, setError] = useState(null);

    const check = async () => {

        const response = await api.get("validacaoFacial/check", {
            imobiliariaId: imobiliaria.id,
            cpf: router.query.cpf,
        });

        // console.log("response");
        // console.log(response);
        // console.log(response.data.status);

        let status = response.data.status;

        // -1   = erro
        // 0    = aguardando
        // 1    = sucesso
    };

    const checkResolution = async () => {

        let constraints = {
            video: {
                width:  { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        let stream = await navigator.mediaDevices.getUserMedia(constraints);
            let stream_settings = stream.getVideoTracks()[0].getSettings();
            // actual width & height of the camera video
            let stream_width = stream_settings.width;
            let stream_height = stream_settings.height;

            setStreamWidth(stream_width)
            setStreamHeight(stream_height)

            console.log('Width: ' + stream_width + 'px');
            console.log('Height: ' + stream_height + 'px');
    };

    const onSubmit = async (data) => {

        try {
            setError(null);

            const response = await api.post("validacaoFacial/step1", {
                imobiliariaId: imobiliaria.id,
                cpf: router.query.cpf,
                foto: photo,
            });

            // sucesso
            if (response.data.status == 1) {
                console.log(1);
                setError(response.data.message);
            } else {
                console.log(2);
                setError(response.data.message);
            }
        } catch (error) {
            // erro de api e execução

            setError(error.message);
            alert(error.message);
        }
    };

    if (typeof window === "undefined") {
        return (<div>
                    <Head>
                        {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/> */}
                    </Head>
                    Loading...
                </div>);
    } else {
        const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
            useFaceDetection({
                faceDetectionOptions: {
                    model: "short",
                },
                // handleOnResults: (res) => {
                // console.log(res)
                // console.log(res.detections.length)
                // if detect 1 face
                // if(res.detections.length == 1) {
                // check position
                // "detections": [
                //     {
                //         "boundingBox": {
                //             "xCenter": 0.47900864481925964,
                //             "yCenter": 0.6954250335693359,
                //             "height": 0.42745697498321533,
                //             "width": 0.3206149935722351,
                //             "rotation": 0,
                //             "rectId": 0
                //         },
                // if(res.detections.boundingBox.xCenter) {}
                // if(res.detections.boundingBox.yCenter) {}
                // if(res.detections.boundingBox.height) {}
                // if(res.detections.boundingBox.width) {}
                // take foto
                // call capture
                // redirect to next step
                // location.href = "http://www.google.com.br";
                // }
                // },
                // faceDetection: new FaceDetection.FaceDetection({
                //      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
                // }) ,
                camera: ({ mediaSrc, onFrame }: CameraOptions) =>
                    new Camera(mediaSrc, {
                        onFrame,
                    }),
            });

        const capture = React.useCallback(() => {
            const imageSrc = webcamRef.current.getScreenshot({
                width: 1280,
                height: 960,
            });
            setPhoto(imageSrc);
        }, [webcamRef]);

        if (
            router.query["cpf"] === undefined ||
            new CPF().valida(router.query.cpf) == "CPF Inválido"
        ) {
            return (
                <Stack
                    maxH="100%"
                    // minW="calc(100vh)"
                    // minH="calc(100vh)"
                    style={{ margin: 0 }}
                    bg="gray.100"
                >
                    <Container 
                        // minW="calc(100vh)" minH="calc(100vh)"
                        >
                        <Center 
                            // minW="calc(100vh)" minH="calc(100vh)"
                            >
                            É necessário informar um CPF válido.
                        </Center>
                    </Container>
                </Stack>
            );
        }

        // if(1) {
        //     return (
        //     <Stack maxH="100%" minW="calc(100vh)" minH="calc(100vh)" style={{margin: 0}}  bg='gray.100'>
        //         <Container minW='calc(100vh)'  minH='calc(100vh)'>
        //             <Center minW='calc(100vh)'  minH='calc(100vh)' >
        //             Sua foto foi enviada. Aguarde a validação ser concluida.
        //             </Center>
        //         </Container>
        //     </Stack>
        // );
        // }

        return (
            <Stack
                maxH="100%"
                // minW="calc(100vh)"
                // minH="calc(100vh)"
                style={{ margin: 0 }}
                bg="gray.100"
                as="form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container 
                    // minW="calc(100vh)" minH="calc(100vh)"
                    >
                    <Center 
                        // minW="calc(100vh)" minH="calc(100vh)"
                        >
                        <Grid
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                sm: "repeat(1, 1fr)",
                                md: "repeat(1, 1fr)",
                                lg: "repeat(1, 1fr)",
                            }}
                            gap={6}
                        >

                            { step == 2 && 
                            <GridItem w="100%">
                                <Box
                                    maxW="sm"
                                    bg="white"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                >
                                    <Box
                                        maxW="sm"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        borderWidth="1px"
                                        borderRadius="lg"
                                    >
                                        <div style={{ 
                                                position: "relative" ,  width:"350px",  height: "350px",   
                                                display: "flex", 
                                                justifyContent: "center"
                                                }}>
                                            {photo == null && (
                                                <>
                                                    <Webcam
                                                        forceScreenshotSourceSize={
                                                            true
                                                        }
                                                        mirrored={true}
                                                        screenshotFormat="image/jpeg"
                                                        ref={webcamRef}
                                                        screenshotQuality={1}
                                                        minScreenshotWidth={
                                                            1280
                                                        }
                                                        minScreenshotHeight={
                                                            960
                                                        }
                                                        style={
                                                            {
                                                                // objectFit: "cover",
                                                                maxWidth: "none",
                                                                maxHeight: "none",
                                                            }
                                                        }
                                                    />
                                                    {boundingBox.map(
                                                        (box, index) => (
                                                            <div
                                                                key={`${
                                                                    index + 1
                                                                }`}
                                                                style={{
                                                                    border: "4px solid red",
                                                                    position:
                                                                        "absolute",
                                                                    top: `${
                                                                        box.yCenter *
                                                                        100
                                                                    }%`,
                                                                    left: `${
                                                                        box.xCenter *
                                                                        100
                                                                    }%`,
                                                                    width: `${
                                                                        box.width *
                                                                        100
                                                                    }%`,
                                                                    height: `${
                                                                        box.height *
                                                                        100
                                                                    }%`,
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                    <div
                                                        className="camera-face-overlay"
                                                        style={{
                                                            borderColor: "outline",
                                                            marginLeft: "15%",
                                                            marginRight: "15%",
                                                            marginTop: "0%",
                                                            marginBottom: "0%",
                                                        }}
                                                    ></div>
                                                </>
                                            )}
                                            {photo != null && (
                                                <div style={{ 
                                                        width: "350px", height: "350px",
                                                        display: "flex", 
                                                        justifyContent: "center"
                                                }}>
                                                    <img src={photo}
                                                        style={{
                                                            // objectFit: "cover",
                                                            maxWidth: "none",
                                                            maxHeight: "none",
                                                            
                                                            }} />
                                                    <div
                                                        className="camera-face-overlay"
                                                        style={{
                                                            borderColor: "outline",
                                                            marginLeft: "15%",
                                                            marginRight: "15%",
                                                            marginTop: "0%",
                                                            marginBottom: "0%",
                                                        }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </Box>
                                    <Box
                                    px={8}
                                    py={4}
                                    w="100%"
                                    h="100%"
                                    bg="white"
                                    borderRadius="lg"
                                >
                                        {error && (
                                        <Flex
                                            color="red"
                                            borderWidth={1}
                                            borderColor="red"
                                        >
                                            <Text w="full" textAlign="center">
                                                {error}
                                            </Text>
                                        </Flex>
                                    )}

                                    <Text m={3} fontSize="sm">
                                        Posicione seu rosto próxima a camera, dentro da
                                        marcação, clique em TIRAR FOTO e depois em VALIDAR.
                                    </Text>
                                    <br/>
                                    <Center>
                                        {photo == null && (
                                            <Button
                                                type="button"
                                                borderRadius={0}
                                                colorScheme="blue"
                                                rightIcon={
                                                    <Icon as={FaSignInAlt} />
                                                }
                                                spinner={
                                                    <BeatLoader
                                                        size={8}
                                                        color="white"
                                                    />
                                                }
                                                onClick={capture}
                                                style={{  display: "inherit", marginLeft: "auto", marginRight: "10" }}
                                            >
                                                TIRAR FOTO
                                            </Button>
                                        )}

                                        {photo != null &&
                                            <Button
                                                type="button"
                                                borderRadius={0}
                                                colorScheme="blue"
                                                rightIcon={
                                                    <Icon as={FaSignInAlt} />
                                                }
                                                spinner={
                                                    <BeatLoader
                                                        size={8}
                                                        color="white"
                                                    />
                                                }
                                                onClick={() => setPhoto(null)}
                                                style={{  display: "inherit", marginLeft: "10", marginRight: "auto" }}
                                            >
                                                REFAZER FOTO
                                            </Button>
                                        }

{photo != null &&
                                            <Button
                                                type="submit"
                                                borderRadius={0}
                                                colorScheme="blue"
                                                rightIcon={
                                                    <Icon as={FaSignInAlt} />
                                                }
                                                spinner={
                                                    <BeatLoader
                                                        size={8}
                                                        color="white"
                                                    />
                                                }
                                                style={{  display: "inherit", marginLeft: "auto", marginRight: "10" }}
                                            >
                                                VALIDAR
                                            </Button>
                                        }
 
                                    </Center>
                                    </Box>
                                    <br />
                                </Box>
                            </GridItem>
                            }

                            { step == 1 && 
                            <GridItem w="100%">
                                <Box
                                    px={8}
                                    py={4}
                                    w="100%"
                                    h="100%"
                                    bg="white"
                                    borderRadius="lg"
                                >
                                    <div style={{ height: 160}}>
                                        {imobiliaria.logo ? (
                                            <Image
                                                h={40}
                                                style={{margin: "0 auto"}}
                                                src={imobiliaria.logo}
                                                alt={imobiliaria.nomeFantasia}
                                            />
                                        ) : (
                                            <Heading
                                                size="lg"
                                                display="flex"
                                                color="blue.500"
                                            >
                                                {imobiliaria.nomeFantasia}
                                            </Heading>
                                        )}
                                    </div>
                                    <br />

                                

                                    <Text fontSize="sm">
                                         Verifique se o CPF está correto antes <br/> 
                                          de prosseguir ou informe a imobiliária.
                                    </Text>

                                    <br />

                                    <FormInput
                                        type="text"
                                        leftElement={
                                            <Icon
                                                as={MdFingerprint}
                                                w={6}
                                                h={6}
                                            />
                                        }
                                        style={{fontWeight: "bold"}}
                                        placeholder="Seu CPF"
                                        {...register("documento")}
                                        error={errors.documento?.message}
                                        value={cpfMask(router.query.cpf)}
                                        readOnly={true}
                                    />

                                    <br />
                                        <Button
                                            type="button"
                                            borderRadius={0}
                                            colorScheme="blue"
                                            rightIcon={
                                                <Icon as={FaSignInAlt} />
                                            }
                                            spinner={
                                                <BeatLoader
                                                    size={8}
                                                    color="white"
                                                />
                                            }
                                            onClick={() => setStep(2)}
                                            style={{  display: "inherit", marginLeft: "auto", marginRight: "10" }}
                                        >
                                            CONTINUAR
                                        </Button>
                                    
                                    {/* 
    <p>{`Loading: ${isLoading}`}</p>
    <p>{`Face Detected: ${detected}`}</p>
    <p>{`Number of faces detected: ${facesDetected}`}</p>
    <p>{`dimensionsWidth: ${dimensions.width}`}</p>
    <p>{`dimensionsHeight: ${dimensions.height}`}</p>
*/}
                                </Box>
                            </GridItem>
                            }
                        </Grid>
                    </Center>
                </Container>
            </Stack>
        );
    }
};
export default ValidacaoFacial;

export const getServerSideProps = async (ctx) => {
    const { site } = ctx.query;
    const imobiliaria = await prisma.imobiliaria.findFirst({
        where: { url: site },
    });
    return { props: { imobiliaria: JSON.parse(JSON.stringify(imobiliaria)) } };
};

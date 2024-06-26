import {
    Box,
    Button,
    Flex,
    GridItem,
    Icon,
    Image as ChakraImage,
    Stack,
    Text,
    Container,
    Center,
    Stepper,
    Step,
    StepIndicator,
    StepIcon,
    StepNumber,
    StepTitle,
    StepDescription,
    StepSeparator,
    StepStatus,
    useSteps,
    Alert,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/react'

import { Slide } from 'react-slideshow-image'

import 'react-slideshow-image/dist/styles.css'

import { FormInput } from '@/components/Form/FormInput'
import prisma from '@/lib/prisma'

import React, { useState, useEffect, useMemo } from 'react'

import { useForm } from 'react-hook-form'
import { MdFingerprint } from 'react-icons/md'

import { FaSignInAlt } from 'react-icons/fa'
import BeatLoader from 'react-spinners/BeatLoader'
import { NextPage } from 'next'
import { Heading } from '@chakra-ui/layout'

import { api } from '@/services/apiClient'
import { useRouter } from 'next/router'

import Webcam from 'react-webcam'
import { CameraOptions, useFaceDetection } from 'react-use-face-detection'

import { Camera } from '@mediapipe/camera_utils'
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi'

/*!
 *	Gerador e Validador de CPF v1.0.0
 *	https://github.com/tiagoporto/gerador-validador-cpf
 *	Copyright (c) 2014-2015 Tiago Porto (http://www.tiagoporto.com)
 *	Released under the MIT license
 */
// function CPF() {
//     'user_strict'
//     function r(r) {
//         for (var t = null, n = 0; 9 > n; ++n)
//             t += r.toString().charAt(n) * (10 - n)
//         var i = t % 11
//         return (i = 2 > i ? 0 : 11 - i)
//     }
//     function t(r) {
//         for (var t = null, n = 0; 10 > n; ++n)
//             t += r.toString().charAt(n) * (11 - n)
//         var i = t % 11
//         return (i = 2 > i ? 0 : 11 - i)
//     }
//     var n = 'CPF Inválido',
//         i = 'CPF Válido'
//         ; (this.gera = function () {
//             for (var n = '', i = 0; 9 > i; ++i)
//                 n += Math.floor(9 * Math.random()) + ''
//             var o = r(n),
//                 a = n + '-' + o + t(n + '' + o)
//             return a
//         }),
//             (this.valida = function (o) {
//                 for (
//                     var a = o.replace(/\D/g, ''),
//                     u = a.substring(0, 9),
//                     f = a.substring(9, 11),
//                     v = 0;
//                     10 > v;
//                     v++
//                 )
//                     if (
//                         '' + u + f ==
//                         '' + v + v + v + v + v + v + v + v + v + v + v
//                     )
//                         return n
//                 var c = r(u),
//                     e = t(u + '' + c)
//                 return f.toString() === c.toString() + e.toString() ? i : n
//             })
// }

function cpfMask(v: any) {
    if (typeof v === 'undefined') return
    v = v.replace(/\D/g, '') //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2') //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2') //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2') //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}

const ValidacaoFacial: NextPage = ({ imobiliaria, validacao }: any) => {
    const [photo, setPhoto] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // check();
        checkResolution()

        setIsClient(true)
    }, [])

    const [error, setError] = useState<string | null>('')

    const check = async () => {
        const response = await api.get('validacaoFacial/check', {
            imobiliariaId: imobiliaria.id,
            cpf: validacao?.cpf,
        })

        let status = response.data.status

        // -1   = erro
        // 0    = aguardando
        // 1    = sucesso
    }

    const checkResolution = async () => {
        //     let constraints = {
        //         video: {
        //             width:  { ideal: 1280 },
        //             height: { ideal: 720 }
        //         }
        //     };
        // let stream = await navigator.mediaDevices.getUserMedia(constraints);
        //     let stream_settings = stream.getVideoTracks()[0].getSettings();
        //     // actual width & height of the camera video
        //     let stream_width = stream_settings.width;
        //     let stream_height = stream_settings.height;
        //     //console.log('Width: ' + stream_width + 'px');
        //     //console.log('Height: ' + stream_height + 'px');
    }

    const getImageDimensions = (base64: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                resolve({ width: img.width, height: img.height })
            }
            img.onerror = reject
            img.src = base64
        })
    }

    const onSubmit = async (data) => {
        try {
            setError(null)

            // Verificar resolução da imagem
            // getImageDimensions(photo)
            //     .then((dimensions) => {
            //         if (dimensions.width >= 720 && dimensions.height >= 1280)
            //             console.log('A resolução é adequada.')
            //         else
            //             setError(
            //                 'Por favor, tire outra foto com uma câmera de melhor resolução, esta está em baixa resolução.',
            //             )
            //     })
            //     .catch((err) => {
            //         setError('Erro ao carregar a imagem:', err)
            //     })

            if (!error) {
                const response = await api.post('validacaoFacial/step1', {
                    id: validacao.id,
                    cpf: validacao?.cpf,
                    foto: photo,
                    pin: validacao?.pin ?? false
                })

                // sucesso
                if (response.data.status == 1) {
                    setError(response.data.message)
                } else {
                    setError(response.data.message)
                }
            }
        } catch (error: any) {
            // erro de api e execução
            setError(error.message)
            alert(error.message)
        }
    }

    const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
        useFaceDetection({
            faceDetectionOptions: {
                model: 'short',
            },
            // handleOnResults: (res) => {
            // //console.log(res)
            // //console.log(res.detections.length)
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
        })

    const capture = React.useCallback(() => {
        // const imageSrc = webcamRef.current.getScreenshot({
        //     width: 720,
        //     height: 1280,
        // })

        const imageSrc = webcamRef.current.getScreenshot()

        setPhoto(imageSrc)
    }, [webcamRef])

    const steps = [
        { title: 'Confirmação' },
        { title: 'Instruções' },
        { title: 'Foto' },
    ]

    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const images = useMemo(
        () => [
            'https://www.imo7.com.br/img/image1.png',
            'https://www.imo7.com.br/img/image2.png',
            'https://www.imo7.com.br/img/image3.png',
            'https://www.imo7.com.br/img/image4.png',
            'https://www.imo7.com.br/img/image5.png',
            'https://www.imo7.com.br/img/image6.png',
            'https://www.imo7.com.br/img/image7.png',
            'https://www.imo7.com.br/img/image8.png',
            'https://www.imo7.com.br/img/image9.png',
            'https://www.imo7.com.br/img/image10.png',
            'https://www.imo7.com.br/img/image11.png',
            'https://www.imo7.com.br/img/image12.png',
        ],
        [],
    )

    if (!isClient)
        return (
            <Flex
                width="100%"
                height="100vh"
                alignItems="center"
                justifyContent="center"
            >
                <Text fontSize="lg" fontWeight="semibold">
                    Loading...
                </Text>
            </Flex>
        )

    return (
        <>
            {(JSON.parse(validacao?.resultado)?.token) ? (
                <Stack>
                    <Container
                        as={Flex}
                        align="center"
                        justify="center"
                        flexDir="column"
                        gap={4}
                        h="100vh"
                    >
                        <Icon
                            as={FiCheck}
                            color="green"
                            fontSize="5xl"
                            mb={8}
                        />
                        <Heading>Foto enviada com sucesso.</Heading>
                        <Text textAlign="center" color="gray">
                            Sua foto foi enviada com sucesso e sua validação
                            está em analise, entraremos em contato.
                        </Text>
                    </Container>
                </Stack>
            ) : (
                <Flex bg="gray.100" minH="100vh" justify="center">
                    <Container
                        as={Flex}
                        minH="100vh"
                        justify="center"
                        flexDir="column"
                        py={24}
                    >
                        {
                            JSON.parse(validacao.resultado)?.codigo
                            && (
                                <Box>
                                    <Text>código: {JSON.parse(validacao.resultado)?.codigo}</Text>
                                    <Text>mensagem: {JSON.parse(validacao.resultado)?.mensagem}</Text>
                                </Box>
                            )
                        }
                        <Stepper index={activeStep} mb={12} overflow="auto">
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box flexShrink="0">
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>
                                            {step.description}
                                        </StepDescription>
                                    </Box>

                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep == 2 && (
                            <>
                                <Heading size="lg" mb={4} color="gray.700">
                                    Exemplos de imagens de face
                                </Heading>
                                <Text fontSize="sm" color="gray">
                                    Recomendamos como padrão de referência de
                                    qualidade das fotos o padrão ICAO. Veja
                                    abaixo alguns problemas comuns em fotos de
                                    face, que devem ser evitados. Nos casos de
                                    imagens com os problemas abaixo, as
                                    requisições podem ser rejeitadas ou ter um
                                    resultado não confiável.
                                </Text>
                                <Box py={4}>
                                    <Slide>
                                        {images.map((image, index) => (
                                            <Box
                                                key={image}
                                                className="each-slide-effect"
                                                bgImg={`${image}`}
                                                h={52}
                                                bgSize="contain"
                                                bgRepeat="no-repeat"
                                                bgPos="center"
                                            ></Box>
                                        ))}
                                    </Slide>
                                </Box>
                            </>
                        )}

                        {activeStep == 3 && (
                            <Flex justify="center">
                                <Box
                                    maxW="sm"
                                    bg="white"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    borderWidth="1px"
                                >
                                    <Box
                                        maxW="sm"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        borderWidth="1px"
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                            }}
                                        >
                                            {photo == null && (
                                                <>
                                                    <Webcam
                                                        mirrored={true}
                                                        screenshotFormat="image/jpeg"
                                                        ref={webcamRef}
                                                        screenshotQuality={1}
                                                    />

                                                    {boundingBox.map(
                                                        (box, index) => (
                                                            <div
                                                                key={`${index + 1
                                                                    }`}
                                                                style={{
                                                                    border: '4px solid red',
                                                                    position:
                                                                        'absolute',
                                                                    top: `${box.yCenter *
                                                                        100
                                                                        }%`,
                                                                    left: `${box.xCenter *
                                                                        100
                                                                        }%`,
                                                                    width: `${box.width *
                                                                        100
                                                                        }%`,
                                                                    height: `${box.height *
                                                                        100
                                                                        }%`,
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                        ),
                                                    )}
                                                    <div
                                                        className="camera-face-overlay"
                                                        style={{
                                                            borderColor:
                                                                'outline',
                                                            marginLeft: '15%',
                                                            marginRight: '15%',
                                                            marginTop: '0%',
                                                            marginBottom: '0%',
                                                        }}
                                                    ></div>
                                                </>
                                            )}

                                            {photo != null && (
                                                <div>
                                                    <ChakraImage
                                                        src={photo}
                                                        objectFit="contain"
                                                        alt="Image"
                                                    />
                                                    <div
                                                        className="camera-face-overlay"
                                                        style={{
                                                            borderColor:
                                                                'outline',
                                                            marginLeft: '15%',
                                                            marginRight: '15%',
                                                            marginTop: '0%',
                                                            marginBottom: '0%',
                                                        }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </Box>
                                    <br />
                                    <Text m={3} fontSize="sm">
                                        Posicione sua face dentro da marcação e
                                        clique em Tirar Foto.
                                    </Text>
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
                                            >
                                                Tirar Foto
                                            </Button>
                                        )}

                                        {photo != null && (
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
                                            >
                                                Refazer Foto
                                            </Button>
                                        )}
                                    </Center>
                                    <br />
                                </Box>
                            </Flex>
                        )}

                        {activeStep == 1 && (
                            <GridItem w="100%">
                                <Box px={8} py={4} bg="white" borderRadius="lg">
                                    <div
                                        style={{
                                            height: 160,
                                        }}
                                    >
                                        {imobiliaria.logo ? (
                                            <ChakraImage
                                                h={40}
                                                objectFit="contain"
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
                                        Confira seu CPF e continue para enviar
                                        para validação.
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
                                        placeholder="Seu CPF"
                                        {...register('documento')}
                                        error={errors.documento?.message}
                                        value={cpfMask(validacao?.cpf)}
                                        readOnly={true}
                                        disabled={true}
                                    />
                                </Box>
                            </GridItem>
                        )}

                        {error && (
                            <Alert status="warning" my={4}>
                                <AlertIcon />
                                <AlertTitle w="full" textAlign="center">
                                    {error}
                                </AlertTitle>
                            </Alert>
                        )}

                        <Flex justify="space-between" mt={12}>
                            <Button
                                leftIcon={<FiArrowLeft />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveStep(activeStep - 1)}
                                isDisabled={activeStep === 1}
                            >
                                Voltar
                            </Button>

                            {activeStep == 3 ? (
                                <Button
                                    rightIcon={<FiArrowRight />}
                                    colorScheme="blue"
                                    size="sm"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    isDisabled={!photo}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Continuar
                                </Button>
                            ) : (
                                <Button
                                    rightIcon={<FiArrowRight />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() =>
                                        setActiveStep(activeStep + 1)
                                    }
                                    type="button"
                                >
                                    Continuar
                                </Button>
                            )}
                        </Flex>
                    </Container>
                </Flex>
            )}
        </>
    )
}
export default ValidacaoFacial

export const getServerSideProps = async (ctx) => {
    const { site, id } = ctx.query
    const imobiliaria = await prisma.imobiliaria.findFirst({
        where: { url: site },
    })

    const validacao = await prisma.validacaoFacial.findFirst({
        where: { id },
    })
    return {
        props: {
            imobiliaria: JSON.parse(JSON.stringify(imobiliaria)),
            validacao: JSON.parse(JSON.stringify(validacao)),
        },
    }
}

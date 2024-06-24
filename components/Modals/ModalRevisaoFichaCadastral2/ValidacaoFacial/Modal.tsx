import { forwardRef, useImperativeHandle, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Image as Img,
    Text,
    Progress,
    Box,
    Flex,
} from '@chakra-ui/react'
import { IValidacaoFacial } from '.'

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [data, setData] = useState<IValidacaoFacial | null>(null)

    const resultado = JSON.parse(data?.resultado ?? '{}')

    useImperativeHandle(ref, () => ({
        onOpen: (props: { data: IValidacaoFacial | null }) => {
            setData(props.data)
            onOpen()
        },
    }))

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody
                    display="flex"
                    flexDirection='column'
                    justifyContent="center"
                    alignItems="center"
                >
                    <Img
                        alt="Imagem"
                        rounded={12}
                        src={data?.fotoUrl}
                    />
                    <Text>{data?.pin}</Text>

                    <Box pos='relative' w='100%'>
                        <Progress
                            size='lg'
                            w='100%'
                            value={
                                resultado
                                    ?.biometria_face
                                    ?.similaridade *
                                100

                                ?? 100
                            }
                            max={
                                100
                            }
                            colorScheme={
                                resultado?.biometria_face?.probabilidade.indexOf(
                                    'Altíssima ',
                                ) >=
                                    0
                                    ? 'green'
                                    : resultado?.biometria_face?.probabilidade.indexOf(
                                        'Alta ',
                                    ) >=
                                        0
                                        ? 'blue'
                                        : resultado?.biometria_face?.probabilidade.indexOf(
                                            'Baixa ',
                                        ) >=
                                            0
                                            ? 'orange'
                                            : 'red'
                            }
                        />
                        <Flex
                            pos="absolute"
                            top={0}
                            justify="center"
                            mx="auto"
                            w="full"
                        >
                            <Text
                                textAlign="center"
                                fontSize="xs"
                                color={
                                    resultado?.biometria_face?.probabilidade.indexOf(
                                        'Altíssima ',
                                    ) >= 0
                                        ? 'white'
                                        : 'white'
                                }
                            >
                                {Math.floor(
                                    resultado
                                        ?.biometria_face
                                        ?.similaridade *
                                    100,
                                ) || 0}{' '}
                                %
                            </Text>
                        </Flex>
                        <Text
                            textAlign="center"
                            fontSize="xs"
                        >{resultado?.biometria_face?.probabilidade}</Text>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export const ModalResultado = forwardRef(ModalBase)


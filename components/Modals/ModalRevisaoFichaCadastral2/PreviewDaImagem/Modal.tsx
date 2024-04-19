import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Image as Img,
    Button,
} from '@chakra-ui/react'

interface ModalProps {
    data: string
}

const ModalBase = ({}, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [data, setData] = useState<string>('')

    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const [modalSize, setModalSize] = useState({
        width: 'auto',
        height: 'auto',
    })

    function handleRotate() {
        setRotate((prev) => prev + 90)
    }

    function handleZoomIn() {
        setScale((prev) => prev + 0.1)
    }

    function handleZoomOut() {
        setScale((prev) => prev - 0.1)
    }

    function handleClear() {
        setRotate(0)
        setScale(1)
    }

    useEffect(() => {
        if (data) {
            const img = new Image()

            img.onload = () => {
                setImageSize({ width: img.width, height: img.height })
                setModalSize({
                    width: img.width + 'px',
                    height: img.height + 'px',
                })
            }

            img.src = data
        }
    }, [data])

    useEffect(() => {
        const extra = 1.1

        setModalSize({
            width: `${imageSize.width * scale * extra}px`,
            height: `${imageSize.height * scale * extra}px`,
        })
    }, [scale, imageSize])

    useImperativeHandle(ref, () => ({
        onOpen: (props: ModalProps) => {
            setData(props.data)
            onOpen()
        },
    }))

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            motionPreset="scale"
        >
            <ModalOverlay />

            <ModalContent maxW={modalSize.width} minH={modalSize.height}>
                <ModalHeader>
                    <ModalCloseButton />

                    <Flex
                        position="fixed"
                        bottom={10}
                        left="50%"
                        zIndex={999}
                        gap={4}
                    >
                        <Button
                            onClick={handleRotate}
                            bg="red.500"
                            color="white"
                            fontWeight="bold"
                            _hover={{
                                bg: 'red.500',
                            }}
                        >
                            GIRAR
                        </Button>
                        <Button
                            onClick={handleZoomIn}
                            bg="red.500"
                            color="white"
                            fontWeight="bold"
                            _hover={{
                                bg: 'red.500',
                            }}
                        >
                            ZOOM +
                        </Button>
                        <Button
                            onClick={handleZoomOut}
                            bg="red.500"
                            color="white"
                            fontWeight="bold"
                            _hover={{
                                bg: 'red.500',
                            }}
                        >
                            ZOOM -
                        </Button>
                        <Button
                            onClick={handleClear}
                            bg="red.500"
                            color="white"
                            fontWeight="bold"
                            _hover={{
                                bg: 'red.500',
                            }}
                        >
                            LIMPAR
                        </Button>
                        <Button
                            onClick={onClose}
                            bg="black"
                            color="white"
                            fontWeight="bold"
                            _hover={{
                                bg: 'black',
                            }}
                        >
                            FECHAR
                        </Button>
                    </Flex>
                </ModalHeader>

                <ModalBody
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minH="calc(100vh)"
                >
                    <Img
                        alt="Preview"
                        rounded={12}
                        src={data}
                        transform={`scale(${scale}) rotate(${rotate}deg)`}
                        maxW="full"
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export const ModalPreviewDaImagem = forwardRef(ModalBase)


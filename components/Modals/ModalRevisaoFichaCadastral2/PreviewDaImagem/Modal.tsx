import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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
import { usePrint } from '@/hooks/usePrint'
import { FaPrint } from 'react-icons/fa'

interface ModalProps {
    data: string
}

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const [data, setData] = useState<string>('')

    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const [modalSize, setModalSize] = useState({
        width: 'auto',
        height: 'auto',
    })
    const contentPrint = useRef()

    const { handlePrint } = usePrint()

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

            <ModalContent width='100vw' minH='100vh' overflow='auto'>
                <ModalHeader>
                    <ModalCloseButton />

                    <Flex
                        position="fixed"
                        bottom={10}
                        justifyContent='center'
                        w='100%'
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
                            onClick={() => handlePrint(contentPrint, 'Imprimir')}
                            bg='red.500'
                            _hover={{
                                bg: 'red.500',
                            }}
                            color='white'
                        >
                            <FaPrint /> IMPRIMIR
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
                    ref={contentPrint}
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


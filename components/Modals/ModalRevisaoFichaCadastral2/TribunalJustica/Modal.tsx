import {
    Box,
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

const ModalBase = ({}, ref: any) => {
    const [url, setUrl] = useState('')
    const [numPages, setNumPages] = useState(1)
    const [pageNumber, setPageNumber] = useState(1)

    const { isOpen, onOpen, onClose } = useDisclosure()

    function onDocumentLoadSuccess(data: any) {
        setNumPages(data.numPages)
        setPageNumber(1)
    }

    useImperativeHandle(ref, () => ({
        onOpen: (src: string) => {
            setUrl(src)
            onOpen()
        },
    }))

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset)
    }

    function previousPage() {
        changePage(-1)
    }

    function nextPage() {
        changePage(1)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="100%">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    {url.includes('.pdf') || url.includes('/pdf') ? (
                        <Flex flexDirection="column">
                            <Flex
                                align="center"
                                justifyContent="center"
                                gap={4}
                                py={2}
                                mb={4}
                            >
                                <Text>
                                    Página {pageNumber || (numPages ? 1 : '--')}{' '}
                                    de {numPages || '--'}
                                </Text>
                                <Button
                                    type="button"
                                    disabled={pageNumber <= 1}
                                    onClick={previousPage}
                                    size="sm"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    disabled={pageNumber >= numPages}
                                    onClick={nextPage}
                                    size="sm"
                                >
                                    Próxima
                                </Button>
                            </Flex>

                            <Flex alignItems="center" justifyContent="center">
                                <Document
                                    file={url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading="Carregando..."
                                >
                                    <Page pageNumber={pageNumber} width={900} />
                                </Document>
                            </Flex>
                        </Flex>
                    ) : (
                        <Image src={url} alt="Image" />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export const ModalTribunalJustica = forwardRef(ModalBase)

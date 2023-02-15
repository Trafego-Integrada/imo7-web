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
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
const Base = ({}, ref) => {
    const [url, setUrl] = useState("");
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess(data) {
        setNumPages(data.numPages);
        setPageNumber(1);
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        onOpen: (src) => {
            setUrl(src);
            onOpen();
        },
    }));
    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    {url.includes(".pdf") ? (
                        <div>
                            <Flex align="center" gap={4} py={2} mb={4}>
                                <Text>
                                    Página {pageNumber || (numPages ? 1 : "--")}{" "}
                                    de {numPages || "--"}
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
                            <Box align="center">
                                <Document
                                    file={url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                >
                                    <Page pageNumber={pageNumber} />
                                </Document>
                            </Box>
                        </div>
                    ) : (
                        <Image src={url} />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalPreview = forwardRef(Base);

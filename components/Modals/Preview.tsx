import {
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../../pdf-worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
const Base = ({}, ref) => {
    const [url, setUrl] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        onOpen: (src) => {
            setUrl(src);
            onOpen();
        },
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    {url.includes(".pdf") ? (
                        <div>
                            <Document
                                file={url}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page pageNumber={pageNumber} />
                            </Document>
                            <p>
                                Page {pageNumber} of {numPages}
                            </p>
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

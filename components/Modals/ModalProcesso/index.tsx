import { useDisclosure } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { EditarProcesso } from "./EditarProcesso";
import { NovoProcesso } from "./NovoProcesso";

const ModalBase = ({}, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState(null);

    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            setId(id);
            if (id) {
                onOpen(id);
            } else {
                onOpen();
            }
        },
    }));
    return (
        <>
            {id ? (
                <EditarProcesso id={id} isOpen={isOpen} onClose={onClose} />
            ) : (
                <NovoProcesso
                    isOpen={isOpen}
                    onClose={onClose}
                    callback={setId}
                />
            )}
        </>
    );
};
export const ModalProcesso = forwardRef(ModalBase);

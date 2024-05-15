import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { ModalTreinamento } from "./Modals/ModalTreinamento";
import { AiFillPlayCircle } from 'react-icons/ai';


export function OpenHelp() {
    const modalTreinamento = useRef()

    function abrirModalTreinamento() {
        modalTreinamento?.current?.onOpen()
    }

    return (
        <>
            <Button
                size="sm"
                colorScheme="red"
                onClick={() => abrirModalTreinamento()}
                display='flex'
                gap='8px'
            >
                <AiFillPlayCircle size={20} /> Ajuda e Treinamento
            </Button>
            <ModalTreinamento ref={modalTreinamento} />
        </>
    )
}
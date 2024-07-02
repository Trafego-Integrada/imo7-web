import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { ModalCadastroValidacaoFacial } from ".";

export function BotaoAbrirModalCadastroValidacaoFacial() {
    const modalValidacaoFacial = useRef()

    function abrirModalCadastroValidacaoFacial() {
        modalValidacaoFacial.current?.onOpen()
    }

    return (
        <>
            <Button
                colorScheme="blue"
                onClick={() => abrirModalCadastroValidacaoFacial()}
            >
                Nova Validação Facial
            </Button>
            <ModalCadastroValidacaoFacial ref={modalValidacaoFacial} />
        </>
    )
}
import { forwardRef, useImperativeHandle } from "react";
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Button,
} from "@chakra-ui/react";

const ModalBase = (
    { consultarNetrin }: { consultarNetrin: () => void },
    ref: any
) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    useImperativeHandle(ref, () => ({
        onOpen: () => {
            onOpen();
        },
    }));

    const renderFonts = (value: any) => (
        <Text
            bg={"blue.500"}
            color="white"
            fontSize={13}
            fontWeight="bold"
            p={1}
            rounded={4}
        >
            {value}
        </Text>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    KYC e Compliance
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody>
                    <Flex gap={8} flexDirection="column">
                        <Flex flexDirection="column" gap={2}>
                            <Text fontWeight="bold">O que é?</Text>

                            <Text>
                                Esta consulta é uma fonte vital de dados
                                essenciais para atender aos requisitos legais e
                                regulatórios relacionados aos processos de
                                identificação de clientes, conhecidos como
                                KYC(know-your-client)(conheça seu cliente). Os
                                dados contidos abrangem informações cruciais
                                sobre pessoas politicamente expostas (PPE ou
                                PEP), sanções e restrições, tanto em âmbito
                                nacional quanto internacional. Além disso, o
                                conjunto de dados inclui indicadores que
                                sinalizam se um indivíduo é considerado PPE ou
                                está sujeito a alguma restrição, juntamente com
                                registros históricos dessas circunstâncias. Um
                                aspecto adicional importante é o conceito de PPE
                                Estendido, que identifica se uma pessoa possui
                                algum vínculo familiar com uma PPE além do
                                primeiro grau, ou outras formas de
                                relacionamento. Ao realizar uma busca, o tipo de
                                relacionamento é explicitado no retorno, como
                                por exemplo (mãe), indicando que a pessoa é mãe
                                de um PEP.
                            </Text>
                        </Flex>

                        <Flex flexDirection="column" gap={2}>
                            <Text fontWeight="bold">Fontes pesquisadas</Text>

                            <Flex gap={2} flexWrap="wrap">
                                {renderFonts("CVM")}
                                {renderFonts("Banco Central")}
                                {renderFonts("OFAC")}
                                {renderFonts("COAF")}
                                {renderFonts("EU")}
                                {renderFonts("GOVUK")}
                                {renderFonts("FBI")}
                                {renderFonts("Interpol")}
                                {renderFonts("UNSC")}
                                {renderFonts("CEAF")}
                                {renderFonts("CNEP")}
                                {renderFonts("Conselho Nacional De Justiça")}
                                {renderFonts("CEPIM")}
                                {renderFonts("Inidôneos TCU")}
                                {renderFonts("Acordos de Leniência")}
                                {renderFonts(
                                    "Processo administrativo disciplinar"
                                )}
                                {renderFonts(
                                    "Impedidos de licitar e contratar banco"
                                )}
                                {renderFonts(
                                    "Tribunal de Contas do Estado de São Paulo"
                                )}
                            </Flex>
                        </Flex>

                        <Flex justifyContent='center'>
                            <Button
                                onClick={() => {
                                    consultarNetrin();
                                    onClose();
                                }}
                                w='50%'
                                bg='green.400'
                                my={4}
                                _hover={{
                                    bg: 'green.400',
                                    opacity: .8
                                }}
                                textColor='white'
                                fontWeight={900}
                            >
                                Fazer Consulta
                            </Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const ModalConfirmarConsulta = forwardRef(ModalBase);


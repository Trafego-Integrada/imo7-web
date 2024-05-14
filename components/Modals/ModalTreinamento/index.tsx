import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import {
    forwardRef,
    useImperativeHandle,

} from "react";

interface ITutorial {
    topicos: string[]
    videoId: string
}

interface IModulo {
    nome: string
    tutoriais: ITutorial[]
}

const modulos: IModulo[] = [
    {
        nome: 'Dashboard',
        tutoriais: [
            {
                topicos: [
                    'Apresentando o sistema e Dashboard',
                    'Video visão geral'
                ],
                videoId: 'aVX1eKxhJMM'
            }
        ]
    },
    {
        nome: 'Usuários',
        tutoriais: [
            {
                topicos: [
                    'Como Cadastrar um usuário?',
                    'Como liberar acesso e permissões dos usuários?',
                    'Como liberar permissão que o usuário acessa somente seus processos e suas fichas?'
                ],
                videoId: 'r83qDrUH9Z0'
            }
        ]
    },
    {
        nome: 'Modelos de fichas',
        tutoriais: [
            {
                topicos: [
                    'Criar modelos das fichas cadastrais',
                    'Como colocar os termos de cada ficha',
                    'Como colocar os aceites de um modelo de uma ficha?'
                ],
                videoId: 'BW4Nzc0Lql8'
            }
        ]
    },
    {
        nome: 'Processos',
        tutoriais: [
            {
                topicos: [
                    'Consultas de processos',
                    'Como adicionar um novo processo?',
                    'Criando imóveis dentro do processo',
                    'Como adicionar fichas dentro de um processo?',
                    'Criando editar valores do imóvel dentro do processo?',
                    'Como adicionar anexos dentro de um processo?',
                    'Campo observações do processo',
                    'Adicionando anexos no processo',
                    'Como adicionar ou remover mais fichas no processo?',
                ],
                videoId: 'uaibZ2RiJog'
            }
        ]
    },
    {
        nome: 'Fichas',
        tutoriais: [
            {
                topicos: [
                    'Botões de navegação das fichas',
                    'Fiador? 2 fichas ou uma só?',
                    'Tela de validação dos dados',
                    'Categoria dos dados',
                    'Como enviar a ficha para um cliente?',
                    'Como que meu cliente vê a ficha?',
                    'Como visualizar a ficha de um cliente',
                    'Consultas dentro das fichas',
                    'Como Fazer validação facial?',
                    'Como editar uma ficha depois de criada o processo?',
                    'Fichas com status "aguardando preenchimento"',
                    'Alterando o status da ficha',
                    'Fazer download dos anexos da ficha',
                    'Fazer download do Excel da ficha',
                ],
                videoId: 'm4HYkxla64E'
            }
        ]
    },
    {
        nome: 'Validação Facial',
        tutoriais: [
            {
                topicos: [
                    'Como fazer a validação Facial',
                    'Como conferir se deu certo a validação facial',
                    'Onde eu faço a pesquisa de validação facial?'
                ],
                videoId: 'UluAYjF7pIo'
            }
        ]
    }
]

const ModalBase = ({ }, ref: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useImperativeHandle(ref, () => ({
        onOpen: () => { onOpen() }
    }))

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='lg'>
            <ModalOverlay />
            <ModalContent backgroundColor='transparent'>
                <ModalBody>
                    <div style={{
                        width: '70vw',
                        backgroundColor: 'white',
                        position: 'absolute',
                        left: '50%',
                        translate: '-50%',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 700,
                            fontSize: '1.5em',
                        }}><h1>Começando a jornada</h1> <ModalCloseButton /></div>
                        {
                            modulos.map(({ nome, tutoriais }, index) => (
                                <Box key={index}>
                                    <Text fontWeight='900'>{nome}</Text>
                                    {
                                        tutoriais.map(({ topicos, videoId }, index) => (
                                            <Box key={index}>
                                                <ul>
                                                    {
                                                        topicos.map((topico, index) => (
                                                            <li key={index}>{topico}</li>
                                                        ))
                                                    }
                                                </ul>
                                                <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${videoId}`} />
                                            </Box>

                                        ))
                                    }
                                </Box>
                            ))
                        }
                    </div>

                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export const ModalTreinamento = forwardRef(ModalBase);

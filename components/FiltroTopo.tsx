import { listarContratos } from "@/services/models/contrato";
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Icon,
    InputGroup,
    InputRightElement,
    List,
    ListItem,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Tag,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "react-query";
import { FormInput } from "./Form/FormInput";
import { FormSelect } from "./Form/FormSelect";
import { ModalContratos } from "./Modals/contratos";

export const FiltroTopo = () => {
    const modalContrato = useRef();
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [query, setQuery] = useState("");
    const { data: contratos } = useQuery(
        ["listaContratos", { query }],
        listarContratos,
        {
            onSuccess: () => {
                onToggle();
            },
            enabled: !!query,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
    return (
        <>
            {/* <FormSelect bg="white">
                <option value="">Inquilino</option>
                <option value="">Propietario</option>
                <option value="">Endereço</option>
                <option value="">Nº do contrato</option>
            </FormSelect> */}

            <Popover
                isOpen={isOpen}
                onClose={onClose}
                placement="bottom"
                closeOnBlur={false}
                autoFocus={false}
            >
                <PopoverTrigger>
                    <FormInput
                        leftElement={<Icon as={FiSearch} />}
                        placeholder="Pesquisa de contratos..."
                        bg="white"
                        color="#03132B"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rounded="full"
                        size="sm"
                    />
                </PopoverTrigger>
                <Portal>
                    <Box zIndex="dropdown">
                        <PopoverContent w="xl" rounded="none" zIndex="modal">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Resultado da pesquisa</PopoverHeader>
                            <PopoverBody>
                                <List>
                                    {contratos?.data?.data?.map((i) => (
                                        <ListItem
                                            p={2}
                                            key={i.id}
                                            _hover={{ bg: "gray.100" }}
                                            onClick={() =>
                                                modalContrato.current.onOpen(
                                                    i.id
                                                )
                                            }
                                        >
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                >
                                                    <Text
                                                        as="span"
                                                        color="gray"
                                                    >
                                                        Cod.:
                                                    </Text>{" "}
                                                    {i.codigo}
                                                </Text>
                                                <Text fontSize="sm">{`${i.imovel?.tipo}, ${i.imovel?.endereco},nº ${i.imovel?.numero}, ${i.imovel?.bairro}, ${i.imovel?.cidade}/${i.imovel?.estado}`}</Text>
                                            </Box>
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="gray"
                                                >
                                                    Inquilinos
                                                </Text>
                                                <Flex gridGap={1}>
                                                    {i.inquilinos.map((i) => (
                                                        <Tag
                                                            key={i.id}
                                                            size="sm"
                                                        >
                                                            {i.nome}
                                                        </Tag>
                                                    ))}
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="gray"
                                                >
                                                    Proprietários
                                                </Text>
                                                <Flex gridGap={1}>
                                                    {i.proprietarios.map(
                                                        (i) => (
                                                            <Tag
                                                                key={i.id}
                                                                size="sm"
                                                            >
                                                                {i.nome}
                                                            </Tag>
                                                        )
                                                    )}
                                                </Flex>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </PopoverBody>
                        </PopoverContent>
                    </Box>
                </Portal>
            </Popover>
            <ModalContratos ref={modalContrato} />
        </>
    );
};

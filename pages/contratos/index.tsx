import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { useQuery } from "react-query";
import { FormDate } from "../../components/Form/FormDate";
import { FormInput } from "../../components/Form/FormInput";
import { FormSelect } from "../../components/Form/FormSelect";
import { Layout } from "../../components/Layout/layout";
import { ModalContratos } from "../../components/Modals/contratos";
import { FiltroContratos } from "../../components/Pages/FIltroContratos";
import { Paginator } from "../../components/Paginator";
import { formatoData } from "../../helpers/helpers";
import { listarContratos } from "../../services/models/contrato";

const Home = () => {
    const modalcontratos = useRef();
    const [filtro, setFiltro] = useState({
        filtro: {},
        pagina: 1,
        linhas: 15,
    });
    const { data, isLoading, isFetching } = useQuery(
        ["contratos", filtro],
        listarContratos
    );
    return (
        <>
            <Layout title="Contratos">
                <Box p={5}>
                    <FiltroContratos />

                    <Box bg="graylight" overflowX="auto" p={5} mt={5}>
                        <Flex p={5} bg="white" gap={4} align="center">
                            <FormInput
                                bg="white"
                                maxW={96}
                                placeholder="Busca rápida..."
                                onChange={(e) =>
                                    setFiltro({
                                        ...filtro,
                                        filtro: {
                                            ...filtro.filtro,
                                            query: e.target.value,
                                        },
                                    })
                                }
                            />
                            {isFetching && <Spinner size="sm" />}
                        </Flex>

                        <Table variant="striped" mt={5} bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Nº do contrato</Th>
                                    <Th>Data de início</Th>
                                    <Th>Data de reajuste</Th>
                                    <Th>Inquilino Principal</Th>
                                    <Th>Endereço</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isLoading ? (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner />
                                        </Td>
                                    </Tr>
                                ) : data && data.data.data.length > 0 ? (
                                    data.data.data.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.codigo}</Td>
                                            <Td>
                                                {formatoData(
                                                    item.dataInicio,
                                                    "DATA_HORA"
                                                )}
                                            </Td>
                                            <Td>{item.dataReajuste}</Td>
                                            <Td>Fernando</Td>
                                            <Td>
                                                {item.imovel?.endereco},{" "}
                                                {item.imovel?.numero},{" "}
                                                {item.imovel?.bairro},{" "}
                                                {item.imovel?.cidade}/
                                                {item.imovel?.estado}
                                            </Td>
                                            <Td>
                                                <IconButton
                                                    as={MdPageview}
                                                    color="bluelight"
                                                    onClick={() =>
                                                        modalcontratos.current.onOpen(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label="Abrir"
                                                />

                                                <IconButton
                                                    as={IoIosRemoveCircle}
                                                    color="red"
                                                    size="sm"
                                                    aria-label="Remover"
                                                />
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            Não há contratos cadastrados ou
                                            resultados para o filtro selecionado
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                        <Paginator filtro={filtro} setFiltro={setFiltro} />
                    </Box>
                </Box>
            </Layout>
            <ModalContratos ref={modalcontratos} />
        </>
    );
};
export default Home;

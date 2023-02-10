import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalFichaCadastral } from "@/components/Modals/ModalFichaCadastral";
import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoData, statusFicha, tipoFicha } from "@/helpers/helpers";
import { listarFichas } from "@/services/models/fichaCadastral";
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    IconButton,
    Progress,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FiEdit, FiEye, FiLink, FiLink2, FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";

const FichasCadastrais = () => {
    const [query, setQuery] = useState("");
    const toast = useToast();
    const router = useRouter();
    const modal = useRef();
    const { data: fichas } = useQuery(["fichas", { query }], listarFichas);
    return (
        <Layout>
            <Box p={4}>
                <Box mb={6}>
                    <Heading size="md" color="gray.600">
                        Fichas Cadastrais
                    </Heading>
                    <Text color="gray" fontSize="sm" fontStyle="italic">
                        Gere e gerêncie as fichas cadastrais
                    </Text>
                </Box>
                <Box>
                    <Flex
                        justify="space-between"
                        align="center"
                        bg="white"
                        p={4}
                    >
                        <Flex gap={4} align="center">
                            <FormInput
                                size="sm"
                                minW={96}
                                placeholder="Encontre uma ficha"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Text fontSize="xs" color="gray" w="full">
                                <Text as="span" fontWeight="bold">
                                    {fichas?.total}
                                </Text>{" "}
                                fichas cadastrais
                            </Text>
                        </Flex>

                        <Button
                            size="sm"
                            leftIcon={<Icon as={FiPlus} />}
                            colorScheme="blue"
                            onClick={() => modal.current.onOpen()}
                        >
                            Novo
                        </Button>
                    </Flex>
                    <Box bg="white" mt={4} p={4}>
                        <TableContainer>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th w={44}>Tipo</Th>
                                        <Th>Nome</Th>
                                        <Th w={44}>Preenchimento</Th>

                                        <Th w={44}>Responsável</Th>
                                        <Th w={24}>Criado em</Th>
                                        <Th w={44}>Status</Th>
                                        <Th w={24}></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {fichas?.data?.length > 0 ? (
                                        fichas.data.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>
                                                    {tipoFicha(
                                                        item.modelo?.tipo
                                                    )}
                                                    <br />
                                                    {item.modelo?.nome}
                                                </Td>
                                                <Td>
                                                    <Text fontWeight="bold">
                                                        {item.nome}
                                                    </Text>
                                                    <Text>
                                                        {item.descricao}
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    <Box pos="relative">
                                                        <Tooltip
                                                            label={`${
                                                                item.preenchimento.filter(
                                                                    (i) =>
                                                                        i.valor
                                                                ).length
                                                            } de ${
                                                                item
                                                                    .preenchimento
                                                                    .length
                                                            } campos preenchidos`}
                                                        >
                                                            <Box>
                                                                <Progress
                                                                    size="lg"
                                                                    value={
                                                                        item.preenchimento.filter(
                                                                            (
                                                                                i
                                                                            ) =>
                                                                                i.valor
                                                                        ).length
                                                                    }
                                                                    max={
                                                                        item
                                                                            .preenchimento
                                                                            .length >
                                                                        0
                                                                            ? item
                                                                                  .preenchimento
                                                                                  .length
                                                                            : 100
                                                                    }
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                        <Flex
                                                            pos="absolute"
                                                            top="0"
                                                            justify="center"
                                                            mx="auto"
                                                            w="full"
                                                        >
                                                            <Text
                                                                textAlign="center"
                                                                fontSize="xs"
                                                                color={
                                                                    Number(
                                                                        (item.preenchimento.filter(
                                                                            (
                                                                                i
                                                                            ) =>
                                                                                i.valor
                                                                        )
                                                                            .length /
                                                                            item
                                                                                .preenchimento
                                                                                .length) *
                                                                            100
                                                                    ).toFixed(
                                                                        0
                                                                    ) == 100
                                                                        ? "white"
                                                                        : "gray"
                                                                }
                                                            >
                                                                {Number(
                                                                    (item.preenchimento.filter(
                                                                        (i) =>
                                                                            i.valor
                                                                    ).length /
                                                                        item
                                                                            .preenchimento
                                                                            .length) *
                                                                        100
                                                                ).toFixed(2)}
                                                                % preenchida
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Td>

                                                <Td>
                                                    {item.responsavel?.nome}
                                                </Td>
                                                <Td>
                                                    {formatoData(
                                                        item.createdAt
                                                    )}
                                                </Td>
                                                <Td>
                                                    {statusFicha(item.status)}
                                                </Td>
                                                <Td>
                                                    <Tooltip label="Visualizar Ficha">
                                                        <Link
                                                            href={`/fichaCadastral/${item.id}`}
                                                            target="_blank"
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEye
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip label="Copiar URL da Ficha">
                                                        <IconButton
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={
                                                                <Icon
                                                                    as={FiLink}
                                                                />
                                                            }
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    `${window.location.origin}/fichaCadastral/${item.id}`
                                                                );
                                                                toast({
                                                                    title: "URL Copiada",
                                                                });
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="Editar Ficha">
                                                        <Link
                                                            href={`/admin/fichas/${item.id}`}
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                variant="ghost"
                                                                icon={
                                                                    <Icon
                                                                        as={
                                                                            FiEdit
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td
                                                colSpan={3}
                                                textAlign="center"
                                                color="gray"
                                            >
                                                Não encontramos fichas
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
            <ModalFichaCadastral ref={modal} />
        </Layout>
    );
};

export default FichasCadastrais;

import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import prisma from "@/lib/prisma";
import {
    atualizarAnexosFicha,
    atualizarFicha,
} from "@/services/models/fichaCadastral";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Image,
    Text,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";
import { useMutation } from "react-query";
import * as yup from "yup";
import "react-quill/dist/quill.snow.css";
import { buscarEndereco } from "@/lib/buscarEndereco";
import moment from "moment";
import QRCode from "react-qr-code";
const FichaCadastral = ({ ficha, campos, modelo }) => {
    return (
        <Box minH="100vh" p={4}>
            <Flex align="center" py={4} gap={6}>
                <Box>
                    <Image w={150} src={ficha.imobiliaria.logo} />
                </Box>
                <Box>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {ficha.imobiliaria.razaoSocial}
                        </Text>{" "}
                        • CNPJ: {ficha.imobiliaria.cnpj}
                    </Text>
                    <Text fontSize="sm">
                        {ficha.imobiliaria.endereco},{ficha.imobiliaria.bairro},
                        {ficha.imobiliaria.cidade}/{ficha.imobiliaria.estado} -
                        CEP: {ficha.imobiliaria.cep}
                    </Text>
                    <Text fontSize="sm">
                        <Text as="span" fontWeight="bold">
                            Fixo:
                        </Text>{" "}
                        {ficha.imobiliaria.telefone} •{" "}
                        <Text as="span" fontWeight="bold">
                            E-mail:
                        </Text>{" "}
                        {ficha.imobiliaria.email} •{" "}
                        <Text as="span" fontWeight="bold">
                            Site:
                        </Text>{" "}
                        {ficha.imobiliaria.site}
                    </Text>
                </Box>
            </Flex>
            <Box py={4}>
                <Heading size="md" textAlign="center">
                    {modelo.nome}
                </Heading>
                <Text textAlign="center" fontSize="sm" color="gray">
                    {modelo.descricao}
                </Text>
                {ficha.status == "aprovada" && (
                    <Alert status="success" my={2}>
                        <AlertIcon />
                        <AlertTitle>Ficha Aprovada</AlertTitle>
                    </Alert>
                )}
                {ficha.status == "reprovada" && (
                    <Alert status="error" my={2}>
                        <AlertIcon />
                        <AlertTitle>Ficha reprovada</AlertTitle>
                        <AlertDescription>
                            {ficha.motivoReprovacao}
                        </AlertDescription>
                    </Alert>
                )}
            </Box>
            <Grid gap={1}>
                {campos
                    .filter((i) =>
                        i.campos.find((e) => modelo?.campos[e.codigo])
                    )
                    .map((item) => (
                        <Box key={item.id} bg="white" p={2} borderWidth={2}>
                            <Heading size="sm" mb={3}>
                                {item.nome}
                            </Heading>
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(5,1fr)",
                                    lg: "repeat(5,1fr)",
                                }}
                                gap={1}
                            >
                                {item.campos
                                    .filter((i) => modelo.campos[i.codigo])
                                    .map((campo) => (
                                        <GridItem
                                            key={campo.id}
                                            colSpan={{
                                                lg:
                                                    campo.tipoCampo == "file"
                                                        ? 1
                                                        : campo.colSpan,
                                            }}
                                        >
                                            <Text
                                                fontWeight="bold"
                                                fontSize="xs"
                                            >
                                                {campo.nome}
                                            </Text>

                                            {campo.tipoCampo == "date" ? (
                                                <Text fontSize="sm">
                                                    {moment(
                                                        ficha.preenchimento[
                                                            campo.codigo
                                                        ]
                                                    ).format("DD/MM/YYYY")}
                                                </Text>
                                            ) : campo.tipoCampo == "file" ? (
                                                ficha.preenchimento[
                                                    campo.codigo
                                                ] ? (
                                                    <QRCode
                                                        size={75}
                                                        value={
                                                            ficha.preenchimento[
                                                                campo.codigo
                                                            ]
                                                        }
                                                    />
                                                ) : null
                                            ) : (
                                                <Text fontSize="sm">
                                                    {
                                                        ficha.preenchimento[
                                                            campo.codigo
                                                        ]
                                                    }
                                                </Text>
                                            )}
                                        </GridItem>
                                    ))}
                            </Grid>
                        </Box>
                    ))}
            </Grid>
            <Box colSpan={{ base: 1, lg: 5 }} py={2} bg="white" mt={4}>
                <Box
                    fontSize={"xs"}
                    dangerouslySetInnerHTML={{
                        __html: modelo.instrucoes,
                    }}
                />
            </Box>
        </Box>
    );
};

export default FichaCadastral;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    let ficha = await prisma.fichaCadastral.findUnique({
        where: { id },
        include: {
            imobiliaria: true,
            modelo: true,
            preenchimento: {
                include: {
                    campo: true,
                },
            },
        },
    });
    const modelo = await prisma.modeloFichaCadastral.findUnique({
        where: {
            id: ficha?.modeloFichaCadastralId,
        },
    });
    const campos = await prisma.categoriaCampoFichaCadastral.findMany({
        where: {
            campos: {
                some: {
                    tipoFicha: ficha?.modelo.tipo,
                },
            },
        },
        orderBy: {
            ordem: "asc",
        },
        include: {
            campos: {
                orderBy: {
                    ordem: "asc",
                },
            },
        },
    });
    let newObj = {};
    let newArq = {};
    let analise = {};
    ficha.preenchimento.map((item) => {
        newObj[item.campoFichaCadastralCodigo] = item.valor;
        analise[item.campoFichaCadastralCodigo] = {
            aprovado: item.aprovado,
            motivoReprovacao: item.motivoReprovacao,
        };
    });
    ficha.preenchimento = newObj;
    ficha.analise = analise;
    return {
        props: {
            ficha: JSON.parse(JSON.stringify(ficha)),
            modelo: JSON.parse(JSON.stringify(modelo)),
            campos: JSON.parse(JSON.stringify(campos)),
        },
    };
};

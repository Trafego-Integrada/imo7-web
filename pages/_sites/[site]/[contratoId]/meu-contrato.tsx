import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { NextChakraLink } from "@/components/NextChakraLink";
import { formatoData, formatoValor } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import prisma from "@/lib/prisma";
import { listarChamados } from "@/services/models/chamado";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCopy, FaEye, FaGrinWink, FaPrint } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoHelpBuoy } from "react-icons/io5";
import { useQuery } from "react-query";

const Dashbord: NextPage = ({ contrato }) => {
    const { usuario } = useAuth();
    const router = useRouter();

    return (
        <LayoutPainel>
            <Heading mb={4} color="gray.700">
                Informações do Contrato
            </Heading>
            <Grid gridTemplateColumns="repeat(3,1fr)" gap={4}>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Numero</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.codigo}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Data de Início</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {formatoData(contrato?.dataInicio)}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Data Fim</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.dataFim && formatoData(contrato?.dataFim)}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Data do Reajuste</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.dataReajuste &&
                            formatoData(contrato?.dataReajuste)}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Dia do Vencimento</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.diaVencimento}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Tipo de Imovel</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.imovel?.tipo}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Endereço do Imovel</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {contrato?.imovel?.endereco}
                    </Text>
                </GridItem>
                <GridItem bg="white" rounded="xl" px={4} py={2}>
                    <Text>Valor do Aluguel</Text>
                    <Text fontWeight="bold" fontSize="lg">
                        {formatoValor(contrato?.valorAluguel)}
                    </Text>
                </GridItem>
            </Grid>
        </LayoutPainel>
    );
};

export default Dashbord;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    try {
        const { contratoId, site } = ctx.query;
        const contrato = await prisma.contrato.findUnique({
            where: {
                id: Number(contratoId),
            },
            include: {
                proprietarios: true,
                inquilinos: true,
                imovel: true,
            },
        });
        return {
            props: {
                contrato: JSON.parse(JSON.stringify(contrato)),
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
});

import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { formatoData, formatoValor } from "@/helpers/helpers";
import { useAuth } from "@/hooks/useAuth";
import prisma from "@/lib/prisma";
import { withSSRAuth } from "@/utils/withSSRAuth";
import {
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Link,
    List,
    ListItem,
    Text,
} from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { FiEye } from "react-icons/fi";

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
                        {contrato?.dataInicio &&
                            formatoData(contrato?.dataInicio)}
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
                {contrato?.anexos?.length > 0 && (
                    <GridItem
                        colSpan={{ lg: 3 }}
                        bg="white"
                        rounded="xl"
                        px={4}
                        py={2}
                    >
                        <Text>Documentos</Text>
                        <List>
                            {contrato?.anexos?.map((anexo) => (
                                <ListItem key={anexo.id}>
                                    <Flex align="center">
                                        <IconButton
                                            icon={<Icon as={FiEye} />}
                                            as={Link}
                                            href={anexo.anexo}
                                            target="_blank"
                                            variant="ghost"
                                            size="sm"
                                        />
                                        <Text ml={2}>{anexo.nome}</Text>
                                    </Flex>
                                </ListItem>
                            ))}
                        </List>
                    </GridItem>
                )}
            </Grid>
        </LayoutPainel>
    );
};

export default Dashbord;

export const getServerSideProps = withSSRAuth(async (ctx) => {
    try {
        const { contratoId, site } = ctx.query;
        const cookies = parseCookies(ctx);
        const token = cookies["imo7.token"];

        const user = jwtDecode<{ permissoes: string[]; cargos: string[] }>(
            token
        );
        const contrato = await prisma.contrato.findUnique({
            where: {
                id: Number(contratoId),
            },
            include: {
                proprietarios: true,
                inquilinos: true,
                imovel: true,
                anexos: {
                    where: {
                        usuariosPermitidos: {
                            some: {
                                id: Number(user.sub),
                            },
                        },
                    },
                },
            },
        });
        console.log(contrato);
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

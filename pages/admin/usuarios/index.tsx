import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPrevious,
    usePagination,
} from "@ajna/pagination";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { MdPageview } from "react-icons/md";
import { useQuery } from "react-query";
import { FormInput } from "@/components/Form/FormInput";
import { Layout } from "@/components/Layout/layout";
import { ModalUsuarios, Usuario } from "@/components/Modals/Usuario";
import { listarUsuarios } from "@/services/models/usuario";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { TabelaUsuarios } from "@/components/Tabelas/Usuarios";
import { useAuth } from "hooks/useAuth";

const Usuarios = ({}) => {
    const { usuario } = useAuth();
    console.log(usuario);
    return (
        <>
            <Layout title="Usuários">
                <TabelaUsuarios
                    adm={usuario?.cargos?.includes("adm") ? true : false}
                    admImobiliaria={
                        usuario?.cargos?.includes("imobiliaria") ? true : false
                    }
                    admConta={usuario?.cargos?.includes("conta") ? true : false}
                    imobiliariaId={usuario?.imobiliariaId}
                    contaId={usuario?.conta?.id}
                />
            </Layout>
        </>
    );
};
export default Usuarios;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);

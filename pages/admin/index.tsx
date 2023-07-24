import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useQuery } from "react-query";

const Home = () => {
    const { isOpen, onToggle } = useDisclosure();
    const modalcontratos = useRef();

    return (
        <>
            <Layout title="Contratos">
                <Box p={5}></Box>
            </Layout>
        </>
    );
};
export default Home;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    {
        cargos: ["imobiliaria", "adm", "conta"],
    }
);

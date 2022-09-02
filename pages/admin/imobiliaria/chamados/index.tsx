import { withSSRAuth } from "@/utils/withSSRAuth";
import { Box } from "@chakra-ui/layout";
import { NextPage } from "next";
import { LayoutPainel } from "../../../components/Layouts/LayoutPainel";

const Chamados: NextPage = () => {
    return <LayoutPainel></LayoutPainel>;
};

export default Chamados;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);

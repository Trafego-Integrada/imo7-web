import { Box } from "@chakra-ui/react";
import { Layout } from "@/components/Layout/layout";
import { withSSRAuth } from "@/utils/withSSRAuth";

const Imoveis = () => {
    return (
        <>
            <Layout title="Imoveis">
                <Box p={5}>
                    <Box bg="graylight" p={5}>
                        Em desenvolvimento
                    </Box>
                </Box>
            </Layout>
        </>
    );
};
export default Imoveis;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);

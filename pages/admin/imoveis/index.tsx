import { Box } from "@chakra-ui/react";
import { Layout } from "@/components/Layout/layout";

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

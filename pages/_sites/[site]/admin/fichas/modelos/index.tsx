import { Layout } from "@/components/Layout/layout";
import { LayoutAdmin } from "@/components/Layouts/LayoutAdmin";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import { Box } from "@chakra-ui/react";

const Page = () => {
    return (
        <Layout>
            <Box p={5}>
                <FichasCadastrais />
            </Box>
        </Layout>
    );
};

export default Page;

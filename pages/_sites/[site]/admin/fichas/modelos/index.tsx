import { Layout } from "@/components/Layout/layout";
import { LayoutAdmin } from "@/components/Layouts/LayoutAdmin";
import { OpenHelp } from "@/components/OpenHelp";
import { FichasCadastrais } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais";
import { Box } from "@chakra-ui/react";

const Page = () => {
    return (
        <Layout>
            <Box p={5}>
                <div style={{
                    position: 'absolute',
                    right: 0
                }}>
                    <OpenHelp />
                </div>
                <FichasCadastrais />
            </Box>
        </Layout>
    );
};

export default Page;

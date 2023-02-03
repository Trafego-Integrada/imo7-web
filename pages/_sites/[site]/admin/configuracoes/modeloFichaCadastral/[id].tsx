import { Layout } from "@/components/Layout/layout";
import { FormModeloFichaCadastral } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais/FormModeloFichaCadastral";
import { useRouter } from "next/router";

const NovoModeloFichaCadastral = () => {
    const router = useRouter();
    return (
        <Layout>
            <FormModeloFichaCadastral id={router.query.id} />
        </Layout>
    );
};

export default NovoModeloFichaCadastral;

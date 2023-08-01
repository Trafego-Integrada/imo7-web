import { Layout } from "@/components/Layout/layout";
import { FormModeloFichaCadastral } from "@/components/Pages/Admin/Configuracoes/FichasCadastrais/FormModeloFichaCadastral";
import { useRouter } from "next/router";

const NovoModeloFichaCadastral = ({ id }) => {
    const router = useRouter();
    return (
        <Layout>
            <FormModeloFichaCadastral id={id} />
        </Layout>
    );
};

export default NovoModeloFichaCadastral;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.query;
    return {
        props: {
            id,
        },
    };
};

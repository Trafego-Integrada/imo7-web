import React from "react";
import { Layout } from "@/components/Layout/layout";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { withSSRAuth } from "@/utils/withSSRAuth";
const Notificacao = () => {
    return (
        <>
            <Layout title="Notificações" subtitle={"Listagem"}>
                <Grid gap={3} templateColumns="repeat(3, 1fr)">
                    <GridItem>2</GridItem>
                    <GridItem>3</GridItem>
                    <GridItem>4</GridItem>
                </Grid>
            </Layout>
        </>
    );
};

export default Notificacao;
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    { cargos: ["imobiliaria", "adm", "conta"] }
);


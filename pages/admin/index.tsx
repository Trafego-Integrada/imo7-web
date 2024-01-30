import { Box } from '@chakra-ui/react'
import React from 'react'
import { Layout } from '@/components/Layout/layout'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { InferGetServerSidePropsType } from "next";

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <Layout title="Contratos">
                <Box p={5}></Box>
            </Layout>
        </>
    )
}
export default Home

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        }
    },
    {
        cargos: ['imobiliaria', 'adm', 'conta'],
    },
)

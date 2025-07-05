import { LayoutPainel } from '@/components/Layouts/LayoutPainel'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { NextPage } from 'next'

const Chamados: NextPage = () => {
    return <LayoutPainel></LayoutPainel>
}

export default Chamados
export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        }
    },
    { cargos: ['imobiliaria', 'adm', 'conta'] },
)

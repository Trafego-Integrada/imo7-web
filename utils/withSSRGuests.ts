import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from 'next'
import { parseCookies } from 'nookies'

export function withSSRGuest<P>(fn: GetServerSideProps<P | any>) {
    return async (
        ctx: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx)
        if (cookies['imo7.token']) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        return await fn(ctx)
    }
}

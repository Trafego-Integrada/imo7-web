import jwtDecode from "jwt-decode";
import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { validadeUserPermissions } from "./validadeUserPermissions";

type WithSSRAuthOptions = {
    permissions?: string[];
    roles?: string[];
};

export function withSSRAuth<P>(
    fn: GetServerSideProps<P>,
    options?: WithSSRAuthOptions
) {
    return async (
        ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies["imo7.token"];
        if (!token) {
            return {
                redirect: {
                    destination: "/auth/signin",
                    permanent: false,
                },
            };
        }

        if (options) {
            const user =
                jwtDecode<{ permissions: string[]; roles: string[] }>(token);
            const { permissions, roles } = options;
            const userHasValidPermissions = validadeUserPermissions({
                user,
                permissions,
                roles,
            });

            if (!userHasValidPermissions) {
                return {
                    redirect: {
                        destination: "",
                        permanent: false,
                    },
                };
            }
        }

        try {
            return await fn(ctx);
        } catch (error) {
            if (error instanceof AuthTokenError) {
                destroyCookie(ctx, "imo7.token");
                destroyCookie(ctx, "imo7.refreshToken");
                return {
                    redirect: {
                        destination: "/auth/signin",
                        permanent: false,
                    },
                };
            } else {
                return {
                    redirect: {
                        destination: "/auth/signin",
                        permanent: false,
                    },
                };
            }
        }
    };
}

import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '@/contexts/AuthContext'
import { AuthTokenError } from './errors/AuthTokenError'
import QueryString from 'qs'

let isRefreshing = false
let failedRequestQueue: {
    onSuccess: (token: string) => void
    onFailure: (err: AxiosError<any>) => void
}[] = []

export function setupApiClient(ctx = undefined) {
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL
            : 'http://localhost:3000/api/',
        headers: {
            Authorization: `Bearer ${cookies['imo7.token']}`,
        },
        paramsSerializer: {
            serialize: (params) => {
                return QueryString.stringify(params, { arrayFormat: 'repeat' })
            },
        },
    })

    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError | any) => {
            if (error.response?.status === 401) {
                if (error.response.data?.code === 'token.expired') {
                    cookies = parseCookies(ctx)
                    //console.log("expirou");
                    const { 'imo7.refreshToken': refreshToken } = cookies
                    const originalConfig = error.config
                    if (!isRefreshing) {
                        isRefreshing = true
                        api.post('auth/refresh', { refreshToken })
                            .then((response) => {
                                const { token, refreshToken: newRefreshToken } =
                                    response.data
                                setCookie(ctx, 'imo7.token', token, {
                                    maxAge: 60 * 60 * 24 * 30,
                                    path: '/',
                                })
                                setCookie(
                                    ctx,
                                    'imo7.refreshToken',
                                    newRefreshToken,
                                    {
                                        maxAge: 60 * 60 * 24 * 30,
                                        path: '/',
                                    },
                                )
                                api.defaults.headers[
                                    'Authorization'
                                ] = `Bearer ${token}`
                                failedRequestQueue.forEach((request) =>
                                    request.onSuccess(token),
                                )
                                failedRequestQueue = []
                            })
                            .catch((err) => {
                                failedRequestQueue.forEach((request) =>
                                    request.onFailure(err),
                                )
                                failedRequestQueue = []
                                if (process.browser) {
                                    signOut()
                                } else {
                                    return Promise.reject(new AuthTokenError())
                                }
                            })
                            .finally(() => {
                                isRefreshing = false
                            })
                    }
                    return new Promise((resolve, reject) => {
                        failedRequestQueue.push({
                            onSuccess: (token: string) => {
                                originalConfig.headers[
                                    'Authorization'
                                ] = `Bearer ${token}`
                                resolve(api(originalConfig))
                            },
                            onFailure: (err: AxiosError) => {
                                reject(err)
                            },
                        })
                    })
                } else {
                    if (process.browser) {
                        signOut()
                    } else {
                        return Promise.reject(new AuthTokenError())
                    }
                }
            }
            return Promise.reject(error)
        },
    )
    return api
}

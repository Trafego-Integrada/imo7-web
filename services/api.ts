import { signOut } from '@/contexts/AuthContext'
import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'
import QueryString from 'qs'

let isRefreshing = false
let failedRequestQueue: {
    onSuccess: (token: string) => void
    onFailure: (err: AxiosError<any>) => void
}[] = []

export function setupApiClient(ctx = null) {
    let cookies = parseCookies(ctx)
    let host

    if (typeof window !== 'undefined') {
        host = window.location.host
        host = host.split('.')[0]
    }

    const url = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:3000/api/'

    const api = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${cookies['imo7.token']}`,
        },
        paramsSerializer: {
            serialize: (params) => {
                return QueryString.stringify(params, { arrayFormat: 'repeat' })
            },
        },
    })

    api.interceptors.request.use((request) => {
        let cookies = parseCookies(null)
        // //console.log(cookies)
        let host
        if (typeof window !== 'undefined') {
            // //console.log(window.location)
            host = window.location.host
            host = host.split('.')[0]
        }
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${cookies['imo7.token']}`,
            imobiliaria:
                host != 'localhost:3000' &&
                host != 'dev.imo7.com.br' &&
                host != 'imo7.com.br' &&
                host != 'imo7'
                    ? host
                    : null,
        }
        return request
    })

    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError | any) => {
            if (error.response?.status === 401) {
                if (error.response.data?.code === 'token.expired') {
                    // //console.log('expirou')
                    cookies = parseCookies()
                    let host
                    if (typeof window !== 'undefined') {
                        host = window.location.host
                        host = host.split('.')[0]
                    }
                    // //console.log(host)
                    const {
                        'imo7.refreshToken': refreshToken,
                        'imo7.token': token,
                    } = cookies
                    const originalConfig = error.config
                    if (!isRefreshing) {
                        // //console.log('expirou 2')
                        isRefreshing = true
                        api.post('auth/refresh', {
                            refreshToken,
                            imobiliaria:
                                host != 'localhost:3000' &&
                                host != 'imo7.com.br' &&
                                host != 'imo7'
                                    ? host
                                    : null,
                        })
                            .then((response) => {
                                const { token, refreshToken: newRefreshToken } =
                                    response.data
                                setCookie(null, 'imo7.token', token, {
                                    maxAge: 60 * 60 * 24 * 30,
                                    path: '/',
                                })
                                setCookie(
                                    null,
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

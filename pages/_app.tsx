import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/AuthContext";
import { QueryClientProvider, useQuery } from "react-query";
import { queryClient } from "../services/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "../config/theme";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
export default MyApp;

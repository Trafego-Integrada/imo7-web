import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
    const theme = extendTheme({
        useSystemColorMode: false,
    });

    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
export default MyApp;

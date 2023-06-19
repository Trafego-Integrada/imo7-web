import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
    sm: "320px",
    md: "768px",
    lg: "1024px",
    xl: "1366px",
});

export const theme = extendTheme({
    fonts: {
        heading: "Rubik, sans-serif",
        body: "Rubik, sans-serif",
    },
    breakpoints,
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
    colors: {
        bluelight: "#2F80ED",
        graydark: "#4F4F4F",
        graylight: "#F0F0F0",
    },
});

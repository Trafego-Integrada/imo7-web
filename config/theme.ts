import { extendTheme, ThemeConfig } from "@chakra-ui/react";
// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};
// 3. extend the theme
const theme = extendTheme({
    fonts: {
        body: "Rubik, sans-serif",
        heading: "Rubik, serif",
        mono: "Menlo, monospace",
    },
    letterSpacings: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0.9em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
    },
    ...config,
});
export default theme;

import NextHead from "next/head";

export const Head = ({ title, description, keywords }) => {
    return (
        <NextHead>
            <title>{title ? title : "Patriota"}</title>
            <link
                rel="shortcut icon"
                href="/favicon-dark.svg"
                type="image/svg"
            />
            <link rel="icon" href="/favicon-dark.svg" type="image/svg" />
        </NextHead>
    );
};

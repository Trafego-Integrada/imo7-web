import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { LinkProps as NextLinkProps } from "next/link";
import { Link } from "@chakra-ui/react";

export type NextChakraLinkProps = PropsWithChildren<
    NextLinkProps & Omit<ChakraLinkProps, "as">
>;

//  Has to be a new component because both chakra and next share the `as` keyword
export const NextChakraLink = ({ children, ...props }: NextChakraLinkProps) => {
    return (
        <Link as={NextLink} {...props}>
            {children}
        </Link>
    );
};

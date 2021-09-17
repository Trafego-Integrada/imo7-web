import {
    Flex,
    Input as InputChakra,
    InputGroup,
    InputLeftElement,
    InputProps,
    InputRightElement,
    Stack,
    Text,
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, ReactElement } from "react";

interface Input extends InputProps {
    leftIcon?: ReactElement;
    rightIcon?: ReactElement;
    error?: string | null;
    as?: ReactElement | null;
}
const InputBase: ForwardRefRenderFunction<HTMLInputElement, Input> = (
    { leftIcon, rightIcon, error, as, ...rest }: Input,
    ref
) => {
    return (
        <Stack maxW="full">
            <InputGroup maxW="full" {...rest}>
                {leftIcon && (
                    <InputLeftElement pointerEvents="none">
                        {leftIcon}
                    </InputLeftElement>
                )}
                <InputChakra
                    ref={ref}
                    as={as}
                    maxW="full"
                    letterSpacing="wider"
                    border={0}
                    borderRadius={0}
                    borderBottomWidth={2}
                    borderBottomStyle="solid"
                    borderBottomColor="primary"
                    _focus={{ outline: 0, borderBottomWidth: 3 }}
                    _hover={{ outline: 0 }}
                    _active={{ outline: 0 }}
                    isInvalid={error ? true : false}
                    {...rest}
                />
                {rightIcon && (
                    <InputRightElement pointerEvents="none">
                        {rightIcon}
                    </InputRightElement>
                )}
            </InputGroup>
            <Text fontSize="sm" color="red" textAlign="center">
                {error}
            </Text>
        </Stack>
    );
};

export const Input = forwardRef(InputBase);

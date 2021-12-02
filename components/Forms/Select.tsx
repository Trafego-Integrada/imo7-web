import {
    Flex,
    Select as SelectChakra,
    InputGroup,
    InputProps,
    Stack,
    Text,
} from "@chakra-ui/react";
import {
    forwardRef,
    ForwardRefRenderFunction,
    ReactElement,
    ReactNode,
} from "react";

interface Input extends InputProps {
    leftIcon?: ReactElement;
    rightIcon?: ReactElement;
    error?: string | null;
    children?: ReactNode;
}
const SelectBase: ForwardRefRenderFunction<HTMLInputElement, Input> = (
    { leftIcon, rightIcon, error, children, label, ...rest }: Input,
    ref
) => {
    return (
        <Stack w="full">
            {label && (
                <Text color="gray.600" fontSize="sm">
                    {label}
                </Text>
            )}
            <SelectChakra
                mt="0 !important"
                ref={ref}
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
            >
                {children}
            </SelectChakra>
            <Text fontSize="sm" color="red" textAlign="center">
                {error}
            </Text>
        </Stack>
    );
};

export const Select = forwardRef(SelectBase);

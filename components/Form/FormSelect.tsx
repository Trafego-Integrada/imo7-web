import {
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    InputRightElement,
    Select,
} from "@chakra-ui/react";
import { forwardRef } from "react";

const InputBase = (
    {
        label,
        description,
        error,
        required,
        leftAddon,
        rightAddon,
        leftElement,
        rightElement,
        children,
        size,
        ...rest
    },
    ref
) => {
    return (
        <FormControl
            isInvalid={error}
            isRequired={required}
            size={size}
            {...rest}
        >
            {label && <FormLabel fontSize={size}>{label}</FormLabel>}
            <InputGroup>
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {leftElement && (
                    <InputLeftElement>{leftElement}</InputLeftElement>
                )}
                <Select ref={ref} size={size} {...rest}>
                    {children}
                </Select>
                {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
                {rightElement && (
                    <InputRightElement>{rightElement}</InputRightElement>
                )}
            </InputGroup>
            {description && <FormHelperText>{description}</FormHelperText>}
            {error && (
                <FormErrorMessage>
                    <FormErrorIcon /> {error}
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

export const FormSelect = forwardRef(InputBase);

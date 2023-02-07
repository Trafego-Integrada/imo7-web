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
    Textarea,
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
        ...rest
    },
    ref
) => {
    return (
        <FormControl isInvalid={error} isRequired={required} maxW="full">
            {label && <FormLabel>{label}</FormLabel>}
            <InputGroup maxW="full">
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {leftElement && (
                    <InputLeftElement>{leftElement}</InputLeftElement>
                )}
                <Textarea
                    ref={ref}
                    {...rest}
                    isInvalid={error ? true : false}
                />
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

export const FormTextarea = forwardRef(InputBase);

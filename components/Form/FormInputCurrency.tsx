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
} from "@chakra-ui/react";
import { forwardRef } from "react";
import CurrencyInput from "react-currency-input-field";
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
        mask,
        maskChar,
        decimal,
        ...rest
    },
    ref
) => {
    return (
        <FormControl isInvalid={error} isRequired={required}>
            {label && <FormLabel>{label}</FormLabel>}
            <InputGroup {...rest}>
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {leftElement && (
                    <InputLeftElement>{leftElement}</InputLeftElement>
                )}
                <Input
                    as={CurrencyInput}
                    intlConfig={
                        !decimal && { locale: "pt-BR", currency: "BRL" }
                    }
                    decimalScale={2}
                    ref={ref}
                    {...rest}
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

export const FormInputCurrency = forwardRef(InputBase);

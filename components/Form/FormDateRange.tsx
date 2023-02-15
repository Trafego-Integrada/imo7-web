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
import { forwardRef, useState } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import DatePicker from "react-datepicker";

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
    const [value, onChange] = useState(new Date());

    return (
        <FormControl isInvalid={error} isRequired={required}>
            {label && <FormLabel>{label}</FormLabel>}
            <InputGroup>
                {leftAddon && (
                    <InputLeftAddon p={0}>{leftAddon}</InputLeftAddon>
                )}
                {leftElement && (
                    <InputLeftElement p={0}>{leftElement}</InputLeftElement>
                )}
                <Input
                    ref={ref}
                    as={DatePicker}
                    selectsRange={true}
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    isClearable={true}
                    borderRadius={8}
                    {...rest}
                />

                {rightAddon && (
                    <InputRightAddon p={0}>{rightAddon}</InputRightAddon>
                )}
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

export const FormDateRange = forwardRef(InputBase);
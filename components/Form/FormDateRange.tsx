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
import DatePicker, { registerLocale } from "react-datepicker";
import br from "date-fns/locale/pt-BR";
registerLocale("pt-BR", br);
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
        size,
        ...rest
    },
    ref
) => {
    const [value, onChange] = useState(new Date());

    return (
        <FormControl
            isInvalid={error}
            isRequired={required}
            size={size}
            zIndex="overlay"
            {...rest}
        >
            {label && <FormLabel fontSize={size}>{label}</FormLabel>}
            <InputGroup size={size}>
                {leftAddon && (
                    <InputLeftAddon p={0}>{leftAddon}</InputLeftAddon>
                )}
                {leftElement && (
                    <InputLeftElement p={0}>{leftElement}</InputLeftElement>
                )}
                <style>
                    {`
                        .react-datepicker-wrapper {
                            width:100%;
                        }
                    `}
                </style>
                <Input
                    ref={ref}
                    as={DatePicker}
                    placeholderText="Selecione a data"
                    selectsRange={true}
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    isClearable={true}
                    size={size}
                    width="full"
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

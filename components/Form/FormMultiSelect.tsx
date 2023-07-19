import {
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    InputRightElement,
} from "@chakra-ui/react";
import { CreatableSelect, Select } from "chakra-react-select";
import { useRouter } from "next/router";
import { forwardRef, useState } from "react";

const InputBase = (
    {
        create,
        label,
        error,
        description,
        rightElement,
        rightAddon,
        leftElement,
        leftAddon,
        children,
        rightElementWidth,
        placeholder,
        ...rest
    },
    ref
) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const router = useRouter();
    return (
        <FormControl isInvalid={error ? true : false} pos="relative">
            {label && <FormLabel>{label}</FormLabel>}
            {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
            {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
            {create ? (
                <CreatableSelect
                    ref={ref}
                    placeholder={placeholder ? placeholder : "Selecione..."}
                    chakraStyles={{
                        container: (_, { selectProps: { width } }) => ({
                            width: "full",
                        }),
                    }}
                    {...rest}
                />
            ) : (
                <Select
                    ref={ref}
                    placeholder={placeholder ? placeholder : "Selecione..."}
                    chakraStyles={{
                        container: () => ({
                            width: "full",
                        }),
                    }}
                    {...rest}
                />
            )}
            {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
            {rightElement && (
                <InputRightElement width={rightElementWidth}>
                    {rightElement}
                </InputRightElement>
            )}
            {error && (
                <FormErrorMessage>
                    <FormErrorIcon />
                    {error}
                </FormErrorMessage>
            )}
            {description && <FormHelperText>{description}</FormHelperText>}
        </FormControl>
    );
};
export const FormMultiSelect = forwardRef(InputBase);

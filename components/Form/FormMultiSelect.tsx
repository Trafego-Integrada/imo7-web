import {
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    InputGroup,
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
        size,
        ...rest
    },
    ref
) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const router = useRouter();
    return (
        <FormControl isInvalid={error ? true : false} size={size} {...rest}>
            {label && <FormLabel fontSize={size}>{label}</FormLabel>}

            {create ? (
                <CreatableSelect
                    ref={ref}
                    placeholder={placeholder ? placeholder : "Selecione..."}
                    chakraStyles={{
                        container: (_, { selectProps: { width } }) => ({
                            ..._,
                            width: "full",
                        }),
                    }}
                    size={size}
                    {...rest}
                />
            ) : (
                <Select
                    ref={ref}
                    placeholder={placeholder ? placeholder : "Selecione..."}
                    chakraStyles={{
                        container: (props) => ({
                            width: "full",
                        }),
                    }}
                    size={size}
                    {...rest}
                />
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

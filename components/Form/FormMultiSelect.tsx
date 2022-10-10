import {
    Button,
    FormControl,
    FormErrorIcon,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Icon,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    InputRightElement,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { css } from "@emotion/react";
import {
    AsyncCreatableSelect,
    AsyncSelect,
    CreatableSelect,
    Select,
} from "chakra-react-select";
import { useRouter } from "next/router";

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
        ...rest
    },
    ref
) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const router = useRouter();
    return (
        <FormControl isInvalid={error ? true : false}>
            {label && <FormLabel>{label}</FormLabel>}
            <InputGroup>
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {leftElement && (
                    <InputLeftElement>{leftElement}</InputLeftElement>
                )}
                {create ? (
                    <CreatableSelect
                        ref={ref}
                        {...rest}
                        chakraStyles={{
                            container: (_, { selectProps: { width } }) => ({
                                width: "full",
                            }),
                        }}
                    />
                ) : (
                    <Select
                        ref={ref}
                        {...rest}
                        chakraStyles={{
                            container: (_, { selectProps: { width } }) => ({
                                width: "full",
                            }),
                        }}
                    />
                )}
                {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
                {rightElement && (
                    <InputRightElement width={rightElementWidth}>
                        {rightElement}
                    </InputRightElement>
                )}
            </InputGroup>
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

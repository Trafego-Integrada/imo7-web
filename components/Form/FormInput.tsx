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
import ReactMask from "react-input-mask";

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
        borderWidth,
        size,
        mask,
        maskChar,
        ...rest
    },
    ref
) => {
    return (
        <FormControl isInvalid={error} isRequired={required} size={size}>
            {label && <FormLabel fontSize={size}>{label}</FormLabel>}
            <InputGroup size={size}>
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {leftElement && (
                    <InputLeftElement p={0}>{leftElement}</InputLeftElement>
                )}
                <Input
                    ref={ref}
                    as={mask && ReactMask}
                    size={size}
                    mask={mask}
                    maskChar={maskChar}
                    borderWidth={borderWidth}
                    {...rest}
                />
                {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
                {rightElement && (
                    <InputRightElement {...rightElement.props}>
                        {rightElement}
                    </InputRightElement>
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

export const FormInput = forwardRef(InputBase);

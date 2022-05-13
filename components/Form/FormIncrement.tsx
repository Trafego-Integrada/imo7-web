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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
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
    <FormControl isInvalid={error} isRequired={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}

        <NumberInput w='100%'>
          <NumberInputField ref={ref} {...rest} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
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

export const FormIncrement = forwardRef(InputBase);

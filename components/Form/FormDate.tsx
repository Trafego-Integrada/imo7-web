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
  InputRightElement
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";


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
        {leftAddon && <InputLeftAddon p={0}>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement p={0} >{leftElement}</InputLeftElement>}
        <DatePicker
          className={'date-picker-style'}
          onChange={onChange}
          value={value}
          {...rest}
          ref={ref}
        />

        {rightAddon && <InputRightAddon p={0}>{rightAddon}</InputRightAddon>}
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

export const FormDate = forwardRef(InputBase);

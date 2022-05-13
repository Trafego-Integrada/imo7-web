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
import { forwardRef } from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
  const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
  )
  return (
    <FormControl isInvalid={error} isRequired={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && <InputLeftAddon p={0}>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement p={0} >{leftElement}</InputLeftElement>}
        <Box
          border='1px solid'
          borderColor='blackAlpha.300'
          w='100%'
        >
          <Editor
            ref={ref} {...rest}
          />
        </Box>
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

export const FormEditor = forwardRef(InputBase);

import {
  Box,
  Flex,
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
  Text
} from "@chakra-ui/react";
import { forwardRef } from "react";
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { ButtonUpload } from '../Gerais/Buttons/ButtonUpload'


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
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <FormControl isInvalid={error} isRequired={required}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && <InputLeftAddon p={0}>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement p={0} >{leftElement}</InputLeftElement>}
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          accept="image/*,audio/*,video/*"
          inputContent={ButtonUpload}
          submitButtonContent='Enviar'
          inputWithFilesContent='Enviar outro arquivo'


          styles={{
            dropzone: {
              border: '1px dashed gray',
              overflow: 'hidden',
              fontSize: '20px',
            },
            dropzoneActive: {
              borderColor: 'blue',
              color: 'blue'
            },
            inputLabelWithFiles: {
              color: 'blue'
            },
            submitButton: {
              background: '#1e256e',
              color: '#fff',
              padding: '10px',
              paddingLeft: '20px',
              paddingRight: '20px'
            }


          }}
          ref={ref} {...rest}
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

export const FormUpload = forwardRef(InputBase);

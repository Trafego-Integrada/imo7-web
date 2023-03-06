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
import {
    AutoComplete,
    AutoCompleteCreatable,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

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
        onChange,
        items = [],
        ...rest
    },
    ref
) => {
    return (
        <FormControl
            isInvalid={error}
            isRequired={required}
            {...rest}
            size={size}
        >
            {label && <FormLabel fontSize={size}>{label}</FormLabel>}
            <InputGroup size={size}>
                <AutoComplete
                    ref={ref}
                    {...rest}
                    onChange={onChange}
                    openOnFocus
                    creatable
                >
                    <AutoCompleteInput size={size}>
                        {({ tags }) =>
                            tags.map((tag, tid) => (
                                <AutoCompleteTag
                                    key={tid}
                                    label={tag.label}
                                    onRemove={tag.onRemove}
                                />
                            ))
                        }
                    </AutoCompleteInput>
                    {/* <AutoCompleteList>
                        {items.map((country, cid) => (
                            <AutoCompleteItem
                                key={`option-${cid}`}
                                value={country}
                                textTransform="capitalize"
                            >
                                {country}
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList> */}
                </AutoComplete>
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

export const FormAutocomplete = forwardRef(InputBase);

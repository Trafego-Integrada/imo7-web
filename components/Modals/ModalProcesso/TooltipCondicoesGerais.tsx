import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip, useDisclosure } from '@chakra-ui/react'
import { FaQuestion } from "react-icons/fa";

export function TooltipCondicoesGerais() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Popover trigger='hover'>
      <PopoverTrigger>
        <Button padding={0} size='auto' bg='transparent' _hover='transparent' ><FaQuestion size={12} /></Button>
      </PopoverTrigger>
      <PopoverContent >
        <PopoverBody>
          Essa informação será apresentada para os clientes na ficha cadastral
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
import { Button, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip, useDisclosure } from '@chakra-ui/react'
import { ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaQuestion } from "react-icons/fa";

export function TooltipTJ(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Popover >
            <PopoverTrigger >
                <Button padding={0} size='auto' bg='transparent' _hover='transparent' ><FaQuestion size={18} /></Button>
            </PopoverTrigger>
            <PopoverContent >
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    Fontes das consultas, nos seguintes tribunais
                </PopoverHeader>
                <PopoverBody>
                    STF, STJ, TRF1, JFAC, JFAM, JFAP, JFBA, JFDF, JFGO, JFMA, JFMG, JFMT, JFPA, JFPI, JFRO, JFRR, JFTO, TRF2, JFES, JFRJ, TRF3, JFMS, JFSP, TRF4, JFPR, JFRS, JFSC, TRF5, JFAL, JFCE, JFPB, JFPE, JFRN, JFSE, TRF6, TJAC, TJAL, TJAM, TJAP, TJBA, TJCE, TJDF, TJES, TJGO, TJMA, TJMG, TJMS, TJMT, TJPA, TJPB, TJPE, TJPI, TJPR, TJRJ, TJRN, TJRO, TJRR, TJRS, TJSC, TJSE, TJSP, TJTO, TRT1, TRT2, TRT3, TRT4, TRT5, TRT6, TRT7, TRT8, TRT9, TRT10, TRT11, TRT12, TRT13, TRT14, TRT15, TRT16, TRT17, TRT18, TRT19, TRT20, TRT21, TRT22, TRT23, TRT24, TST, TRE-AC, TRE-AL, TRE-AM, TRE-AP, TRE-BA, TRE-CE, TRE-DF, TRE-ES, TRE-GO, TRE-MA, TRE-MG, TRE-MS, TRE-MT, TRE-PA, TRE-PB, TRE-PE, TRE-PI, TRE-PR, TRE-RJ, TRE-RN, TRE-RO, TRE-RR, TRE-RS, TRE-SC, TRE-SE, TRE-SP, TRE-TO, TSE.
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
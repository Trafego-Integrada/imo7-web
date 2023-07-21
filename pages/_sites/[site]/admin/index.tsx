import {
    Box,
    Button,
    Collapse,
    Container,
    Flex,
    Grid,
    GridItem,
    HStack,
    Heading,
    Icon,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Stat,
    StatArrow,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useRadio,
    useRadioGroup,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import {
    MdCheck,
    MdClose,
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPageview,
} from "react-icons/md";
import { FormDate } from "@/components/Form/FormDate";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { Layout } from "@/components/Layout/layout";
import { ModalContratos } from "@/components/Modals/contratos";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { BsCalendarWeek } from "react-icons/bs";

const Home = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [filtro, setFiltro] = useState({
        periodo: "semanal",
    });
    const options = [
        {
            label: "Últimos 7 dias",
            value: "semanal",
        },
        {
            label: "Último mês",
            value: "mensal",
        },
        {
            label: "Último trimestre",
            value: "trimestral",
        },
        {
            label: "Último semestre",
            value: "semestral",
        },
        {
            label: "Último ano",
            value: "atual",
        },
        {
            label: "Personalizado",
            value: "personalizado",
        },
    ];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "periodo",
        defaultValue: "semanal",
        onChange: (v) => setFiltro({ ...filtro, periodo: v }),
    });

    const group = getRootProps();
    function RadioCard(props) {
        const { getInputProps, getRadioProps } = useRadio(props);

        const input = getInputProps();
        const checkbox = getRadioProps();

        return (
            <Box as="label">
                <input {...input} />
                <Box
                    {...checkbox}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="md"
                    boxShadow="sm"
                    _checked={{
                        bg: "blue.600",
                        color: "white",
                        borderColor: "blue.600",
                    }}
                    _focus={{
                        boxShadow: "outline",
                    }}
                    px={4}
                    py={1}
                    fontSize={12}
                >
                    {props.children}
                </Box>
            </Box>
        );
    }
    console.log(filtro);
    return (
        <>
            <Layout>
                <Container maxW="container.lg" p={5}>
                    <Flex mb={4}>
                        <Popover placement="top-start" isOpen={isOpen}>
                            <PopoverTrigger>
                                <Button
                                    leftIcon={<BsCalendarWeek />}
                                    size="sm"
                                    variant="outline"
                                    colorScheme="blue"
                                    zIndex={20}
                                    onClick={onOpen}
                                >
                                    Últimos 7 dias
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                mt={-50}
                                ml={-3}
                                pt={50}
                                zIndex="10"
                            >
                                <PopoverBody>
                                    <Flex wrap="wrap" gap={2} {...group}>
                                        {options.map((item) => {
                                            const radio = getRadioProps({
                                                value: item.value,
                                            });
                                            return (
                                                <RadioCard
                                                    key={item.value}
                                                    {...radio}
                                                >
                                                    {item.label}
                                                </RadioCard>
                                            );
                                        })}
                                    </Flex>
                                </PopoverBody>
                                <PopoverFooter
                                    gap={2}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        leftIcon={<MdClose />}
                                        colorScheme="gray"
                                        onClick={onClose}
                                    >
                                        Desistir
                                    </Button>
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        leftIcon={<MdCheck />}
                                    >
                                        Aplicar
                                    </Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    </Flex>
                    <Grid>
                        <GridItem>
                            <Heading size="md" color="gray" mb={4}>
                                Boletos
                            </Heading>
                            <StatGroup gap={2}>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Boletos emitidos</StatLabel>
                                    <StatNumber>345,670</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="increase" />
                                        23.36%
                                    </StatHelpText>
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Boletos à receber</StatLabel>
                                    <StatNumber>45</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText>
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>E-mails enviados</StatLabel>
                                    <StatNumber>345,670</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="increase" />
                                        23.36%
                                    </StatHelpText>
                                </Stat>
                                <Stat bg="white" p={4}>
                                    <StatLabel>Whatsapps enviados</StatLabel>
                                    <StatNumber>45</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="decrease" />
                                        9.05%
                                    </StatHelpText>
                                </Stat>
                            </StatGroup>
                        </GridItem>
                    </Grid>
                </Container>
            </Layout>
        </>
    );
};
export default Home;

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
    {
        cargos: ["imobiliaria", "adm", "conta"],
    }
);

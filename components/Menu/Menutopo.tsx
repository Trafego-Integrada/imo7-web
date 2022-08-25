import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    GridItem,
    Icon,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import React from "react";
import { BiPowerOff, BiSupport } from "react-icons/bi";
import { BsFillGearFill, BsSearch } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiAccountCircleFill, RiMenu3Fill } from "react-icons/ri";
import { FormInput } from "../Form/FormInput";
import { FormSelect } from "../Form/FormSelect";
import { Listagemmenu } from "./Listagemmenu";
import { Logo } from "./Logo";

export const Menutopo = ({ namepage, subnamepage }) => {
    const { usuario, signOut } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    return (
        <>
            <Box
                d={{ sm: "flex", md: "none" }}
                w="100%"
                bg="bluelight"
                h="120px"
                alignItems="center"
                p={5}
            >
                <Grid templateColumns="repeat(3, 1fr)" w="100%">
                    <GridItem w="100%" d="flex" alignItems="center">
                        <Logo />
                    </GridItem>
                    <GridItem
                        w="100%"
                        d="flex"
                        alignItems="center"
                        color="white"
                    >
                        <Text fontSize="1xl" letterSpacing={"2px"}>
                            {namepage}
                        </Text>
                    </GridItem>
                    <GridItem
                        w="100%"
                        d="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Button ref={btnRef} bg="orange" onClick={onOpen}>
                            <RiMenu3Fill color="white" size={"20px"} />
                        </Button>
                    </GridItem>
                </Grid>

                <Drawer
                    isOpen={isOpen}
                    placement="right"
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent bg="graydark">
                        <DrawerCloseButton color="white" />
                        <DrawerHeader>
                            <Flex
                                fontSize="3xl"
                                fontWeight="bold"
                                letterSpacing="2px"
                            >
                                <Text color="white">Imo</Text>
                                <Text color="orange">7</Text>
                            </Flex>
                        </DrawerHeader>

                        <DrawerBody>
                            <Listagemmenu />
                        </DrawerBody>

                        <DrawerFooter></DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Box>

            <Box
                d={{ sm: "none", md: "flex" }}
                ml={{ base: "0px", md: "120px" }}
                w="100%"
                bg="bluelight"
                h="120px"
                alignItems="center"
            >
                <Grid templateColumns="repeat(3, 1fr)" w="100%" p={5}>
                    <GridItem w="100%">
                        <Flex
                            gap={1}
                            color="white"
                            d="flex"
                            alignItems="center"
                        >
                            <Text fontSize="3xl" letterSpacing={"2px"}>
                                {namepage}
                            </Text>
                            {subnamepage > "0" ? (
                                <Text fontSize="3xl">|</Text>
                            ) : (
                                ""
                            )}
                            <Text fontSize="1xl">{subnamepage}</Text>
                        </Flex>
                    </GridItem>

                    <GridItem d="flex" w="100%" alignItems="center" gap={3}>
                        <FormSelect bg="white">
                            <option value="">Inquilino</option>
                            <option value="">Propietario</option>
                            <option value="">Endereço</option>
                            <option value="">Nº do contrato</option>
                        </FormSelect>

                        <InputGroup size="md">
                            <FormInput
                                placeholder="Pesquisa de contratos..."
                                bg="rgba(94, 93, 93, 0.5)"
                                color="white"
                            />
                            <InputRightElement>
                                <Icon as={BsSearch} color="white" />
                            </InputRightElement>
                        </InputGroup>
                    </GridItem>

                    <GridItem
                        w="100%"
                        d="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Menu>
                            <MenuButton
                                as={Button}
                                bg="none"
                                border="none"
                                _hover={{
                                    bg: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                _focus={{ bg: "none", border: "none" }}
                                _active={{ bg: "none", border: "none" }}
                            >
                                <Flex alignItems="center" color="white">
                                    <Avatar
                                        name={usuario?.nome}
                                        src={usuario?.avatar}
                                    />
                                    <MdOutlineKeyboardArrowDown size="30" />
                                </Flex>
                            </MenuButton>
                            <MenuList>
                                <MenuGroup title="Perfil">
                                    <MenuItem>
                                        <RiAccountCircleFill size="20" />
                                        <Text pl="2">Minha conta</Text>
                                    </MenuItem>
                                    <MenuItem>
                                        <BsFillGearFill size="20" />
                                        <Text pl="2">Configurações</Text>
                                    </MenuItem>
                                </MenuGroup>
                                <MenuDivider />
                                <MenuGroup title="Ajuda">
                                    <MenuItem>
                                        <BiSupport size="20" />{" "}
                                        <Text pl="2">Chamados</Text>
                                    </MenuItem>
                                </MenuGroup>
                                <MenuItem onClick={() => signOut()}>
                                    <BiPowerOff size="20" />
                                    <Text pl="2"> Sair</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </GridItem>
                </Grid>
            </Box>
        </>
    );
};

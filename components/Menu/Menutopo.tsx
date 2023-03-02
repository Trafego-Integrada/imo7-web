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
import { FiltroTopo } from "@/components/FiltroTopo";
import { FormInput } from "@/components/Form/FormInput";
import { FormSelect } from "@/components/Form/FormSelect";
import { NextChakraLink } from "@/components/NextChakraLink";
import { Listagemmenu } from "./Listagemmenu";
import { Logo } from "./Logo";

export const Menutopo = ({ namepage, subnamepage }) => {
    const { usuario, signOut } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    return (
        <>
            <Box
                display={{ sm: "flex", md: "none" }}
                w="100%"
                bg="bluelight"
                h="100px"
                alignItems="center"
                p={5}
            >
                <Grid templateColumns="repeat(3, 1fr)" w="100%">
                    <GridItem w="100%" display="flex" alignItems="center">
                        <Logo />
                    </GridItem>
                    <GridItem
                        w="100%"
                        display="flex"
                        alignItems="center"
                        color="white"
                    >
                        <Text fontSize="1xl" letterSpacing={"2px"}>
                            {namepage}
                        </Text>
                    </GridItem>
                    <GridItem
                        w="100%"
                        display="flex"
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
                display={{ sm: "none", md: "flex" }}
                ml={{ base: "0px", md: "100px" }}
                w="100%"
                bg="bluelight"
                h="100px"
                alignItems="center"
            >
                <Grid templateColumns="repeat(3, 1fr)" w="100%" p={5}>
                    <GridItem w="100%">
                        <Flex
                            gap={1}
                            color="white"
                            display="flex"
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

                    <GridItem
                        display="flex"
                        w="100%"
                        alignItems="center"
                        gap={3}
                    >
                        <FiltroTopo />
                    </GridItem>

                    <GridItem
                        w="100%"
                        display="flex"
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
                                    <MenuItem
                                        as={NextChakraLink}
                                        href="/minha-conta"
                                    >
                                        <Flex>
                                            <RiAccountCircleFill size="20" />
                                            <Text pl="2">Minha conta</Text>
                                        </Flex>
                                    </MenuItem>
                                </MenuGroup>
                                <MenuDivider />
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

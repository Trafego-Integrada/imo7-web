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
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import React from "react";
import { BiPowerOff } from "react-icons/bi";
import { MdMenu, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiltroTopo } from "@/components/FiltroTopo";
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
                w="full"
                bg="#73C4E1"
                h={12}
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
                        <IconButton
                            ref={btnRef}
                            icon={<MdMenu />}
                            colorScheme="orange"
                            onClick={onOpen}
                            variant="gray"
                        />
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
                ml={{ base: "0px" }}
                w="100%"
                bg="radial-gradient(274.41% 274.41% at 50% 50%, #012659 0%, rgba(0, 0, 0, 0.00) 100%), #03132B;"
                h={16}
                alignItems="center"
            >
                <Grid templateColumns="repeat(3, 1fr)" w="100%" p={5}>
                    <GridItem w="100%">
                        <Flex
                            gap={1}
                            color="white"
                            display="flex"
                            align="center"
                            h="full"
                        >
                            <Text fontSize="lg" letterSpacing={"2px"}>
                                {namepage}
                            </Text>
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
                        {/* <Button onClick={toggleColorMode}>
                            Toggle {colorMode === "light" ? "Dark" : "Light"}
                        </Button> */}
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
                                        size="sm"
                                    />
                                    <MdOutlineKeyboardArrowDown />
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

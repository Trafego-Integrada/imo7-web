import { Box, Button, Collapse, Flex, Icon, List, ListItem, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react";
import { BsCircle } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

export const MenuItem = ({ icon, title, href, subMenus }) => {
    const router = useRouter();
    const [show, setShow] = React.useState(false)
    const handleToggle = () => setShow(!show)



    return <>
        <ListItem
            d={{ sm: 'flex', md: 'none' }}

            flexDir='column'
            w='full'
            rounded='none'
            bg={router.asPath == href ? "orange" : "none"}
            color='white'
            _hover={{ bg: 'blue.600' }}
            cursor='pointer'
            role='group'
            p={3}

        >
            <Box>
                <Flex
                    flexDir={{ md: 'column' }}
                    alignItems='center'
                    gap={2}

                >
                    <Flex
                        gap={2}
                        onClick={() => router.push(href)}

                    >
                        <Icon as={icon} fontSize={{ base: '1xl', md: '3xl' }} />
                        <Text fontWeight="normal" fontSize="sm">
                            {title}
                        </Text>
                    </Flex>



                    {subMenus &&
                        <Button
                            bg='none'
                            _hover={{ bg: 'none', border: 'none', cursor: 'pointer' }}
                            _focus={{ bg: 'none', border: 'none' }}
                            _active={{ bg: 'none', border: 'none' }}
                            onClick={handleToggle}

                        >

                            {show ? <Icon as={MdOutlineKeyboardArrowUp} /> : <Icon as={MdOutlineKeyboardArrowDown} />}

                        </Button>
                    }

                </Flex>
            </Box>



            {subMenus && (

                <Collapse in={show}>
                    <List
                        d='flex'
                        flexDir="column"
                    >
                        {subMenus.map((item, key) => (
                            <ListItem
                                as={Button}
                                key={key}
                                bg='none'
                                rounded="none"
                                textAlign="left"
                                justifyContent="left"
                                p='3'
                                leftIcon={<Icon as={BsCircle} />}
                                onClick={() => router.push(item.href)}
                                fontSize="sm"
                            >
                                {item.title}
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </ListItem>










        <ListItem
            d={{ sm: 'none', md: 'flex' }}
            justifyContent='center'
            alignItems='center'
            flexDir='column'
            w='full'
            rounded='none'
            borderRight={router.asPath == href ? "5px solid orange" : "none"}
            color='white'
            _hover={{ bg: 'gray.600' }}
            onClick={() => router.push(href)}
            cursor='pointer'
            role='group'
            borderBottom='1px solid rgba(255,255,255,0.2)'
            p={5}
            pos='relative'
        >
            <Flex
                flexDir={{ md: 'column' }}
                alignItems='center'
            >
                <Icon as={icon} fontSize={{ base: '1xl', md: '3xl' }} />
                <Text fontWeight="normal" fontSize="sm">
                    {title}
                </Text>
            </Flex>


            {subMenus && (
                <List
                    display="none"
                    pos="absolute"
                    left="120px"
                    top={0}
                    flexDir="column"
                    _groupHover={{ display: "flex", height: '100%' }}
                >
                    {subMenus.map((item, key) => (
                        <ListItem
                            as={Button}
                            key={key}
                            bg="graydark"
                            rounded="none"
                            textAlign="left"
                            justifyContent="left"
                            p='3'
                            leftIcon={<Icon as={BsCircle} />}
                            onClick={() => router.push(href)}
                            fontSize="sm"
                        >
                            {item.title}
                        </ListItem>
                    ))}
                </List>
            )}

        </ListItem>




    </>
}
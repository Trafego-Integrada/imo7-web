import { Box, Button, Flex, FormControl, Img, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FormInput } from "../components/Form/FormInput";
import { Logo } from "../components/Menu/Logo";


const Login = () => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const router = useRouter();
    return <>
        <Flex
            w='100%'
        >
            <Box
                d={{ sm: 'none', lg: 'flex' }}
                w={{ md: '40%', lg: '70%' }}
                minH='100vh'
            >
                <Img src='bglogin.jpg' />
            </Box>
            <Box
                w={{ sm: '100%', md: '100%', lg: '30%' }}
                minH='100vh'
                bg='bluelight'
                d='flex'
                alignItems='center'
                justifyContent='center'
            >
                <Box d='flex' flexDir='column' justifyContent='center' >
                    <Logo />
                    <Text fontSize='2xl' color='white' textAlign='center'>Faça seu login</Text>


                    <Box p={5}>
                        <FormControl d='flex' flexDir='column' gap={5} >

                            <FormInput
                                label='Email'
                                placeholder='endereço de email...'
                                leftAddon={<FaRegUserCircle color="gray.300" />}
                                color='white'

                            />
                            <FormInput
                                color='white'
                                label='Senha'
                                placeholder='digite sua senha...'
                                type={show ? "text" : "password"}
                                leftAddon={

                                    <RiLockPasswordFill color="gray.300" />
                                }
                                rightAddon={
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                        {show ? 'Ocultar' : 'Mostrar'}
                                    </Button>}

                            />
                            <Box d='flex' justifyContent='flex-end'>
                                <Text color='white'>Esqueceu a senha?</Text>
                            </Box>

                            <Button bg='orange' color='white' onClick={() => router.back()}>
                                Entrar
                            </Button>
                        </FormControl>
                        <Text color='white'>Não é registrado ainda? Entre em contato <Link color='orange' href='https://trafegointegrada.com.br/'>Trafego Soluções</Link></Text>

                    </Box>



                </Box>
            </Box>
        </Flex>

    </>
}
export default Login;
import { Button, Link } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsApp() {
    return (
        <Link
            position='fixed'
            bottom={4}
            right={4}
            target='blank'
            href="https://api.whatsapp.com/send?phone=5519997538567&text=Gostaria de saber mais informações sobre o IMO7"
        >
            <Button w={20} h={20} backgroundColor='green' p='4px' _hover={{ backgroundColor: 'green', opacity: .8 }} rounded='50%'>
                <FaWhatsapp color="white" size={40} />
            </Button>
        </Link>
    )
}
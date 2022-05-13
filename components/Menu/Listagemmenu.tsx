import { List } from "@chakra-ui/react"
import { HiOutlineDocumentText } from "react-icons/hi"
import { FaHandHoldingUsd, FaUser, FaUsers, FaUserTie } from "react-icons/fa"
import { BiSupport } from "react-icons/bi"
import { MenuItem } from "./Menuitem"
import { BsFillGearFill, BsHouseFill } from "react-icons/bs"
import { MdDashboard } from "react-icons/md"


export const Listagemmenu = () => {
    return <>
        <List d="flex" flexDir="column">
            <MenuItem title="Contratos" href='/' icon={HiOutlineDocumentText} />
            <MenuItem title="Cobranças" href='/cobrancas' icon={FaHandHoldingUsd}
                subMenus={[
                    {
                        title: 'Boletos',
                        href: '#',
                    },
                    {
                        title: 'Extratos',
                        href: '#'
                    },
                ]}
            />
            <MenuItem title="Inquilinos" href='/inquilinos' icon={FaUsers} />
            <MenuItem title="Propietários" href='/propietarios' icon={FaUserTie} />
            <MenuItem title="Usuários" href='/usuarios' icon={FaUser} />
            <MenuItem title="Chamados" href='/chamados' icon={BiSupport} />
            <MenuItem title="Imóveis" href='/imoveis' icon={BsHouseFill} />
            <MenuItem title="Configurações" href='/configuracoes' icon={BsFillGearFill} />
            <MenuItem title="Gerencial" href='/gerencial' icon={MdDashboard} />
        </List>

    </>
}

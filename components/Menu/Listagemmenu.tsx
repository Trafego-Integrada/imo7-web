import { List } from "@chakra-ui/react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaHandHoldingUsd, FaUser, FaUsers, FaUserTie } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { MenuItem } from "./Menuitem";
import { BsFillGearFill, BsHouseFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";

export const Listagemmenu = () => {
    return (
        <>
            <List d="flex" flexDir="column">
                <MenuItem
                    title="Contratos"
                    href="/admin/contratos"
                    icon={HiOutlineDocumentText}
                />
                <MenuItem
                    title="Cobranças"
                    href="/admin/cobrancas"
                    icon={FaHandHoldingUsd}
                    subMenus={[
                        {
                            title: "Boletos",
                            href: "/admin/cobrancas",
                        },
                        {
                            title: "Extratos",
                            href: "#",
                        },
                    ]}
                />
                <MenuItem
                    title="Inquilinos"
                    href="/admin/inquilinos"
                    icon={FaUsers}
                />
                <MenuItem
                    title="Propietários"
                    href="/admin/propietarios"
                    icon={FaUserTie}
                />
                <MenuItem
                    title="Usuários"
                    href="/admin/usuarios"
                    icon={FaUser}
                />
                <MenuItem
                    title="Chamados"
                    href="/admin/chamados"
                    icon={BiSupport}
                />
                <MenuItem
                    title="Imóveis"
                    href="/admin/imoveis"
                    icon={BsHouseFill}
                />
                <MenuItem
                    title="Configurações"
                    href="/admin/configuracoes"
                    icon={BsFillGearFill}
                />
                <MenuItem
                    title="Gerencial"
                    href="/admin/gerencial"
                    icon={MdDashboard}
                />
            </List>
        </>
    );
};

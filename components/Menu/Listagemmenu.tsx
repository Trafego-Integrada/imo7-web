import { List } from "@chakra-ui/react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaHandHoldingUsd, FaUser, FaUsers, FaUserTie } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { MenuItem } from "./Menuitem";
import { BsFillGearFill, BsHouseFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { includesAll } from "@/helpers/helpers";
import { useAuth } from "hooks/useAuth";
import { isArray } from "lodash";

const menu = [
    {
        titulo: "Contratos",
        href: "/admin/contratos",
        icon: HiOutlineDocumentText,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.contratos"],
    },
    {
        titulo: "Cobranças",
        href: "/admin/boletos",
        icon: FaHandHoldingUsd,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.cobrancas"],
        subMenus: [
            {
                titulo: "Boletos",
                href: "/admin/boletos",
                icon: HiOutlineDocumentText,
                cargos: ["imobiliaria"],
                modulos: ["imobiliaria.cobrancas.boletos"],
            },
        ],
    },
    {
        titulo: "Inquilinos",
        href: "/admin/inquilinos",
        icon: FaUsers,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.inquilinos"],
    },
    {
        titulo: "Proprietários",
        href: "/admin/proprietarios",
        icon: FaUserTie,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.proprietarios"],
    },
    {
        titulo: "Usuários",
        href: "/admin/usuarios",
        icon: FaUser,
        cargos: ["imobiliaria", "adm", "conta"],
        modulos: ["imobiliaria.usuarios"],
    },
    {
        titulo: "Chamados",
        href: "/admin/chamados",
        icon: BiSupport,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.chamados"],
    },
    {
        titulo: "Imoveis",
        href: "/admin/imoveis",
        icon: BsHouseFill,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.imoveis"],
    },
    {
        titulo: "Configurações",
        href: "/admin/configuracoes",
        icon: BsFillGearFill,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.configuracoes"],
    },

    {
        titulo: "Gerencial",
        href: "/admin/gerencial",
        icon: MdDashboard,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.gerencial"],
    },
    {
        titulo: "Usuários",
        href: "/admin/usuarios",
        icon: BsFillGearFill,
        cargos: ["adm"],
        modulos: ["adm.usuarios"],
    },
    {
        titulo: "Contas",
        href: "/admin/contas",
        icon: BsFillGearFill,
        cargos: ["adm"],
        modulos: ["adm.contas"],
    },
    {
        titulo: "Imobiliarias",
        href: "/admin/imobiliarias",
        icon: BsFillGearFill,
        cargos: ["adm"],
        modulos: ["adm.imobiliarias"],
    },
];

export const Listagemmenu = () => {
    const { usuario } = useAuth();
    return (
        <>
            <List d="flex" flexDir="column">
                {menu.map((item) => {
                    if (
                        item.cargos.length == 0 ||
                        (isArray(usuario?.cargos) &&
                            item.cargos.filter((i) => {
                                if (usuario.cargos?.find((um) => um == i)) {
                                    return true;
                                }
                            }).length &&
                            isArray(usuario?.modulos) &&
                            item.modulos.filter((i) => {
                                if (usuario.modulos?.find((um) => um == i)) {
                                    return true;
                                }
                            }).length)
                    ) {
                        return (
                            <MenuItem
                                key={item.titulo}
                                title={item.titulo}
                                href={item.href}
                                icon={item.icon}
                                subMenus={item.subMenus}
                            />
                        );
                    }
                })}
            </List>
        </>
    );
};

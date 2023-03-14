import { List } from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { isArray } from "lodash";
import { BiSupport } from "react-icons/bi";
import { BsFillGearFill, BsHouseFill } from "react-icons/bs";
import { FaHandHoldingUsd, FaUser, FaUsers, FaUserTie } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { TbForms } from "react-icons/tb";
import { MenuItem } from "./Menuitem";

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
        titulo: "Extratos",
        href: "/admin/extratos",
        icon: FaHandHoldingUsd,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.cobrancas"],
        
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
        titulo: "Fichas",
        href: "/admin/fichas",
        icon: TbForms,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.fichas"],
        subMenus: [
            {
                titulo: "Fichas Excluídas",
                href: "/admin/fichas/excluidas",
                icon: HiOutlineDocumentText,
                cargos: ["imobiliaria"],
                modulos: ["imobiliaria.fichas.excluidas"],
            },
        ],
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
        cargos: ["adm"],
        modulos: ["adm.gerencial"],
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
    {
        titulo: "Cadastros",
        href: "/admin/cadastros",
        icon: BsFillGearFill,
        cargos: ["adm"],
        modulos: ["adm.imobiliarias"],
    },
];

export const Listagemmenu = () => {
    const { usuario } = useAuth();
    return (
        <>
            <List display="flex" flexDir="column" overflow="auto">
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

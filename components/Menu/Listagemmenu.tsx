import { List } from "@chakra-ui/react";
import { useAuth } from "hooks/useAuth";
import { isArray } from "lodash";
import { BiSupport, BiTask } from "react-icons/bi";
import { BsFillGearFill, BsHouseFill } from "react-icons/bs";
import {
    FaFileInvoice,
    FaHandHoldingUsd,
    FaUser,
    FaUsers,
    FaUserTie,
} from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
    MdCategory,
    MdDashboard,
    MdNewspaper,
    MdOutlineNotificationsActive,
    MdOutlineRule,
} from "react-icons/md";
import { TbForms } from "react-icons/tb";
import { MenuItem } from "./Menuitem";

const menu = [
    {
        titulo: "Regua",
        href: "/admin/regua",
        icon: MdOutlineRule,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.regua"],
    },
    {
        titulo: "Tarefas",
        href: "/admin/tarefas",
        icon: BiTask,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.contratos"],
    },
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
        subMenus: [
            {
                titulo: "Boletos",
                href: "/admin/extratos",
                icon: HiOutlineDocumentText,
                cargos: ["imobiliaria"],
                modulos: ["imobiliaria.cobrancas"],
            },
            {
                titulo: "Validações Faciais",
                href: "/admin/validacoesfaciais",
                icon: HiOutlineDocumentText,
                cargos: ["imobiliaria"],
                modulos: ["imobiliaria.validacoesfaciais"],
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
        titulo: "Orçamentos",
        href: "/admin/orcamentos",
        icon: FaFileInvoice,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.contratos"],
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
        titulo: "Cadastros",
        icon: BsFillGearFill,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.configuracoes"],
        subMenus: [
            {
                titulo: "Pessoas",
                href: "/admin/cadastros/pessoas",
                icon: HiOutlineDocumentText,
                cargos: [],
                modulos: [],
            },
            {
                titulo: "Departamentos",
                href: "/admin/cadastros/departamentos",
                icon: HiOutlineDocumentText,
                cargos: [],
                modulos: [],
            },
            {
                titulo: "Categorias de Pessoas",
                href: "/admin/cadastros/categoriasPessoa",
                icon: MdCategory,
                cargos: [],
                modulos: [],
            },
            {
                titulo: "Tags de Tarefas",
                href: "/admin/cadastros/tagsTarefa",
                icon: FiTag,
                cargos: [],
                modulos: [],
            },
        ],
    },

    {
        titulo: "Configurações",
        href: "/admin/configuracoes",
        icon: BsFillGearFill,
        cargos: ["imobiliaria"],
        modulos: ["imobiliaria.configuracoes"],
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
        href: "/admin/filaEnvio",
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
    {
        titulo: "Fila de Envio",
        href: "/admin/filaEnvio",
        icon: MdNewspaper,
        cargos: ["imobiliaria", "adm"],
        modulos: ["imobiliaria.configuracoes"],
    },
];

export const Listagemmenu = () => {
    const { usuario } = useAuth();

    return (
        <>
            <List display="flex" flexDir="column">
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

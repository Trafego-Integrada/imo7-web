import {
    Breadcrumb as BreadcrumbChakra,
    BreadcrumbItem,
    BreadcrumbLink,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdHome, MdKeyboardArrowRight } from "react-icons/md";

export const Breadcrumb = ({ history }) => {
    const router = useRouter();
    return (
        <BreadcrumbChakra
            display="flex"
            alignItems="center"
            separator={<Icon as={MdKeyboardArrowRight} />}
            color={useColorModeValue("primary", "secondary")}
        >
            <BreadcrumbItem>
                <Icon as={MdHome} />
            </BreadcrumbItem>

            {history.map((item, key) => (
                <BreadcrumbItem
                    key={key}
                    isCurrentPage={router.asPath == item.href ? true : false}
                >
                    <BreadcrumbLink href={item.href}>
                        {item.label}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            ))}
        </BreadcrumbChakra>
    );
};

import { FormSelect } from "@/components/Form/FormSelect";
import { Paginator2 } from "@/components/Paginator2";
import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPrevious,
} from "@ajna/pagination";
import { Box, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export const Paginacao = ({
    currentPage,
    pagesCount,
    setCurrentPage,
    pages,
    pageSize,
    setPageSize,
}) => {
    return (
        <Flex justify="space-between" px={4} align="center" gap={4}>
            <Flex align="center">
                <Text fontSize="sm" color="gray">
                    Mostrar
                </Text>
                <FormSelect
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    size="sm"
                    variant="ghost"
                >
                    <option value="20">20</option>
                    <option value="60">60</option>
                    <option value="120">120</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                </FormSelect>
            </Flex>
            <Paginator2
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={pagesCount}
                pages={pages}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </Flex>
    );
};

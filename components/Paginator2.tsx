import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    PaginationSeparator,
} from "@ajna/pagination";
import { PaginationProps } from "@ajna/pagination/dist/components/Pagination";
import { Flex, IconButton, Text, Icon } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FormSelect } from "./Form/FormSelect";

interface PaginatorProps {
    pages: number[];
    pagesCount: number;
    currentPage: number;
    setCurrentPage: PaginationProps["onPageChange"];
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export const Paginator2 = ({
    pages,
    pagesCount,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
}: PaginatorProps) => {
    return (
        <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
        >
            <PaginationContainer gridGap={4} align="center">
                <PaginationPrevious
                    as={IconButton}
                    icon={<Icon as={FiArrowLeft} />}
                    variant="unstyled"
                    size="xs"
                />
                <PaginationPageGroup
                    isInline
                    gridGap={2}
                    separator={<PaginationSeparator jumpSize={11} size="xs" />}
                >
                    {pages?.map((page: number) => (
                        <PaginationPage
                            key={`pagination_page_${page}`}
                            page={page}
                            variant="unstyled"
                            size="xs"
                            _current={{
                                fontWeight: "bold",
                                color: "blue",
                            }}
                        />
                    ))}
                </PaginationPageGroup>
                <PaginationNext
                    as={IconButton}
                    icon={<Icon as={FiArrowRight} />}
                    variant="unstyled"
                    size="xs"
                />
            </PaginationContainer>
        </Pagination>
    );
};

import { Box, Flex, Text } from "@chakra-ui/layout";
import { NextPage } from "next";
import { Header } from "../../components/Header";
import { LayoutAdmin } from "../../components/Layouts/LayoutAdmin";

const Dashboard: NextPage = () => {
    return (
        <LayoutAdmin>
            <Header>
                <Text>Dashboard</Text>
            </Header>
        </LayoutAdmin>
    );
};

export default Dashboard;

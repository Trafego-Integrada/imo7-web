import { Avatar, Icon, List, ListItem } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { LayoutPainel } from "@/components/Layouts/LayoutPainel";
import { FiArrowLeft, FiSend, FiSettings } from "react-icons/fi";
import { setupApiClient } from "@/services/api";
import * as yup from "yup";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
const schema = yup.object({
    mensagem: yup.string().required("Campo Obrigatório"),
});
const Chamado: NextPage = ({ boleto }) => {
    const router = useRouter();

    return (
        <LayoutPainel>
            <Flex py={2}>
                <Button
                    leftIcon={<Icon as={FiArrowLeft} />}
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Voltar
                </Button>
            </Flex>
            <Box>
                <Box>
                    <Text>Nº do Documento</Text>
                    <Text>{boleto.num_doc2}</Text>
                </Box>
                <Box>
                    <Text>Data de Emissão</Text>
                    <Text>{boleto.data_doc}</Text>
                </Box>
                <Box>
                    <Text>Vencimento</Text>
                    <Text>{boleto.data_vencimen}</Text>
                </Box>
                <Box>
                    <Text>Local de Pagamento</Text>
                    <Text>{boleto.local_pgto1}</Text>
                </Box>
                <Box>
                    <Text>Beneficiário</Text>
                    <Text>{boleto.beneficiario}</Text>
                </Box>
            </Box>
            <Box>
                <List>
                    <ListItem>{boleto.instrucoes1}</ListItem>
                    <ListItem>{boleto.instrucoes2}</ListItem>
                    <ListItem>{boleto.instrucoes3}</ListItem>
                    <ListItem>{boleto.instrucoes4}</ListItem>
                    <ListItem>{boleto.instrucoes5}</ListItem>
                    <ListItem>{boleto.instrucoes6}</ListItem>
                    <ListItem>{boleto.instrucoes7}</ListItem>
                    <ListItem>{boleto.instrucoes8}</ListItem>
                    <ListItem>{boleto.instrucoes9}</ListItem>
                    <ListItem>{boleto.instrucoes10}</ListItem>
                </List>
            </Box>
        </LayoutPainel>
    );
};

export default Chamado;
export const getServerSideProps = async (ctx) => {
    const { boletoId } = ctx.query;
    const api = setupApiClient(ctx);
    const { data } = await api.get(`boleto/${boletoId}`);
    return {
        props: {
            boleto: data,
        },
    };
};

import { useState } from "react";
import {
    removerCaracteresEspeciais,
    verificarExtensaoImagem,
} from "@/helpers/helpers";
import { isDisplayed } from "@/utils/registerFormFieldsAuxiliar";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Grid,
    GridItem,
    Image,
    Tag,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { AnaliseCampo } from "../ModalRevisaoFichaCadastral/AnaliseCampo";
import { Consultas } from "./Consultas";

export const Categoria = ({
    categoria,
    modeloFicha,
    ficha,
    buscarFicha,
}: any) => {
    const [open, setOpen] = useState(false);

    const dadosPreenchimentoCampo = (codigo: string) =>
        ficha.preenchimento.find(
            (p: any) => p.campoFichaCadastralCodigo == codigo
        );

    return (
        <Accordion
            allowToggle
            display="flex"
            flexDir="column"
            gap={2}
            onChange={() => setOpen(!open)}
        >
            <AccordionItem key={categoria.id} bg="white" rounded="xl" p={4}>
                <AccordionButton onClick={() => setOpen(!open)}>
                    {categoria?.nome}
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                    <Consultas
                        ficha={ficha}
                        cpf={removerCaracteresEspeciais(
                            dadosPreenchimentoCampo(
                                categoria.campos.find(
                                    (c: any) => c.tipoCampo == "cpf"
                                )?.codigo
                            )?.valor
                        )}
                        cnpj={removerCaracteresEspeciais(
                            dadosPreenchimentoCampo(
                                categoria.campos.find(
                                    (c: any) => c.tipoCampo == "cnpj"
                                )?.codigo
                            )?.valor
                        )}
                        dataNascimento={removerCaracteresEspeciais(
                            dadosPreenchimentoCampo(
                                categoria.campos.find(
                                    (c: any) => c.tipoCampo == "date"
                                )?.codigo
                            )?.valor
                        )}
                        campoFichaCadastralCodigo={
                            dadosPreenchimentoCampo(
                                categoria.campos.find(
                                    (c: any) => c.tipoCampo == "cpf"
                                )?.codigo
                            )?.campoFichaCadastralCodigo
                        }
                    />

                    <Grid
                        marginTop={4}
                        gridTemplateColumns={{
                            base: "repeat(1,1fr)",
                            lg: "repeat(5,1fr)",
                        }}
                        gap={4}
                    >
                        {categoria.campos
                            .filter((i: any) => isDisplayed(i, modeloFicha))
                            .map((campo: any) => (
                                <GridItem
                                    key={campo.key}
                                    colSpan={{ lg: campo.colSpan }}
                                >
                                    <Flex>
                                        <Text>{campo.nome}</Text>
                                        {dadosPreenchimentoCampo(campo.codigo)
                                            ?.aprovado ? (
                                            <Tag colorScheme="green" size="sm">
                                                Aprovado
                                            </Tag>
                                        ) : dadosPreenchimentoCampo(
                                              campo.codigo
                                          )?.motivoReprovacao ? (
                                            <Tooltip
                                                label={`Motivo da reprovação: ${
                                                    dadosPreenchimentoCampo(
                                                        campo.codigo
                                                    )?.motivoReprovacao
                                                }`}
                                                bg="red"
                                                color="white"
                                                hasArrow
                                            >
                                                <Tag
                                                    colorScheme="red"
                                                    size="sm"
                                                >
                                                    Reprovado{" "}
                                                </Tag>
                                            </Tooltip>
                                        ) : (
                                            ""
                                        )}
                                        <AnaliseCampo
                                            campoCodigo={campo?.codigo}
                                            fichaId={ficha?.id}
                                            buscarFicha={buscarFicha}
                                        />
                                    </Flex>
                                    <Text fontWeight="bold">
                                        {ViewValor(
                                            campo,
                                            ficha.preenchimento.find(
                                                (p: any) =>
                                                    p.campoFichaCadastralCodigo ==
                                                    campo.codigo
                                            )?.valor
                                        )}
                                    </Text>
                                </GridItem>
                            ))}
                    </Grid>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

const ViewValor = (campo: any, valor: any) => {
    if (valor) {
        if (["image"].includes(campo.tipoCampo)) {
            return JSON.parse(valor).map((i: any) => (
                <Image key={i} src={i} w={32} h={32} rounded={99} alt="Image" />
            ));
        } else if (["file", "files"].includes(campo.tipoCampo)) {
            return (
                <Flex flexDir="row" gap={2} wrap="wrap">
                    {JSON.parse(valor).map((i: any) => {
                        if (verificarExtensaoImagem(i).eImagem) {
                            return (
                                <Image
                                    key={i}
                                    src={i}
                                    w={24}
                                    h={24}
                                    rounded="lg"
                                    aria-label="Arquivo"
                                />
                            );
                        } else {
                            return (
                                <Flex
                                    key={i}
                                    align="center"
                                    justify="center"
                                    w={24}
                                    h={24}
                                    bg="gray.200"
                                    rounded="lg"
                                >
                                    <Text>
                                        {verificarExtensaoImagem(i).extensao}
                                    </Text>
                                </Flex>
                            );
                        }
                    })}
                </Flex>
            );
        } else {
            return valor;
        }
    }
};
